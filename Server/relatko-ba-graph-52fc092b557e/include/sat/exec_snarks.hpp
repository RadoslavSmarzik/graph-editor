#ifndef BA_GRAPH_SAT_EXEC_SNARKS_HPP
#define BA_GRAPH_SAT_EXEC_SNARKS_HPP

#include "solver_cmsat.hpp"
#include "exec_factors.hpp"

#include "../invariants/girth.hpp"
#include "../snarks/colouring_cvd.hpp"
#include "../snarks/colouring_nagy.hpp"

namespace ba_graph
{

class SatSolverColouriser
{
    const SatSolver &solver;

  public:
    SatSolverColouriser(const SatSolver &solver)
        : solver(solver) {}

    bool isColourable(const Graph &G) const
    {
        auto cnf = cnf_edge_colouring(G, 3, true);
        return satisfiable(solver, cnf);
    }
};

class CMSatColouriser : public SatSolverColouriser 
{
    CMSatSolver cmsolver;
  public:
    CMSatColouriser() : SatSolverColouriser(cmsolver) {}
};

class OptimisedColouriser {
public:
    // constants chosen based on experimental evidence
    bool isColourable(const Graph &G) const {
        if (is3EdgeColourable_cvd(G, 1))
            return true;

        if (G.order() < 50) {
            NagyColouriser nagyC;
            return nagyC.isColourable(G);
        } else {
            if (is3EdgeColourable_cvd(G))
                return true;

            CMSatColouriser cmsatC;
            return cmsatC.isColourable(G);
        }
    }
    // FIXME does not work well with OpenMP, for very odd reasons
    // if OptimisedColouriser is used in nc.cpp instead of NagyColouriser (despite it just calls the nagy one),
    // it takes about three times as long with multiple threads vs. just 1 thread
    // using DefaultColouriser is better than NagyColouriser
};

namespace internal
{

inline bool oddnessCallback(Graph &F, int *currentOddnessEstimate)
{
    int odd = 0;
    GraphNumberLabeling<bool> used(false, F);
    for (auto &r : F) {
        if (used[r.n()])
            continue;
        auto circuit = shortest_cycle(F, r.n());
        for (auto v : circuit)
            used.set(v, true);
        if (circuit.size() % 2 == 1)
            ++odd;
    }
    *currentOddnessEstimate = std::min(*currentOddnessEstimate, odd);
    return true;
}

} // namespace internal

inline int oddness_allsat(const AllSatSolver &solver, const Graph &G)
{
    Factory f;
    Graph H(copy_other_factory(G, f));
    int oddness = H.order() + 1;
    two_factors_enumerate_allsat_cubic(solver, H, f, internal::oddnessCallback, &oddness);
    return oddness;
}

}  // namespace end

#endif

