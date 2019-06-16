#include <cassert>
#include <cmath>
#include <iomanip>
#include <sstream>

#include "implementation.h"
#include <invariants/colouring.hpp>
#include <invariants/degree.hpp>
#include <io/graph6.hpp>
#include <graphs.hpp>

using namespace ba_graph;

const std::string correctAnswer = R"(
1
11
11111
0111111111111111110
0000111111111111111111111111111111111111111111111111111111111101111111111111111111111
00000000000000000000000111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000011111111111111001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111011111111111111101111111111101111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
)";

bool countColourings(VertexLabeling<int>, int *c)
{
    ++*c;
    return true;
}

bool countEdgeColourings(EdgeLabeling<int>, int *c)
{
    ++*c;
    return true;
}

bool test_removal(const Graph &G)
{
    EdgeLabeling<int> precolouring(-1);
    for (auto &v : G) {
        if (v.degree() == 1)
            precolouring.set(v.find(IP::all())->e(), 0);
    }
    assert(!is_edge_colourable_basic(G, 3, precolouring));
    bool isColourableAfterRemoval = false;
    for (auto &v : G) {
        if (v.degree() == 1) continue;
        Factory f;
		auto [H, m] = copy_other_factory<EdgeMapper>(G, f);
		EdgeLabeling<int> prec2(-1);
		for (auto e : G.list(RP::all(), IP::primary(), IT::e()))
			prec2.set(m.get(e), precolouring[e]);
        deleteV(H, v.n(), f);
        if (is_edge_colourable_basic(H, 3, prec2))
            isColourableAfterRemoval = true;
    }
    return isColourableAfterRemoval;
}

int main()
{
    Graph g0(empty_graph(0));
    int c0 = 0;
    enumerate_colourings_basic(g0, 3, countColourings, &c0);
    assert(c0 == 1);

    Graph g1(empty_graph(11));
    assert(is_colourable_basic(g1, 5));
    assert(!is_colourable_basic(g1, 0));
    assert(chromatic_number_basic(g1) == 1);

    Graph g2(empty_graph(4));
    int c2 = 0;
    enumerate_colourings_basic(g2, 3, countColourings, &c2);
    assert(c2 == 81);
    addE(g2, Location(0, 1));
    addE(g2, Location(0, 2));
    addE(g2, Location(0, 3));
    addE(g2, Location(1, 2));
    assert(chromatic_number_basic(g2) == 3);
    Graph g2lg(line_graph(g2));
    assert(chromatic_number_basic(simplify(g2lg)) == max_deg(g2));

    Graph g3(create_petersen());
    assert(chromatic_number_basic(g3) == 3);
    Graph g3lg(line_graph(g3));
    assert(chromatic_number_basic(simplify(g3lg)) == 4);

    Graph g4(complete_bipartite_graph(4, 7));
    assert(chromatic_number_basic(g4) == 2);
    assert(chromatic_index_basic(g4) == 7);

    Graph g5(complete_graph(7));
    assert(chromatic_number_basic(g5) == 7);
    assert(chromatic_index_basic(g5) == 7);

    Graph a1(complete_graph(4));
    assert(is_edge_colourable_basic(a1, 3));
    EdgeLabeling<int> precolouring(-1);
    Edge e01 = a1[0].find(Location(0, 1))->e();
    Edge e02 = a1[0].find(Location(0, 2))->e();
    precolouring.set(e01, 2);
    precolouring.set(e02, 2);
    assert(!is_edge_colourable_basic(a1, 3, precolouring));
    precolouring.set(e02, 0);
    assert(is_edge_colourable_basic(a1, 3, precolouring));
    int ca1 = 0;
    assert(enumerate_edge_colourings_basic(a1, 3, countEdgeColourings, &ca1, precolouring));
    assert(ca1 == 1);

    Graph a2(create_petersen());
    assert(!is_edge_colourable_basic(a2, 3));
    assert(chromatic_index_basic(a2) == 4);

    std::stringstream output;
    output << std::endl;
    for (int i = 4; i <= 14; i += 2) {
        std::string filename = "../../resources/graphs/" + internal::stored_cubic_path(1, 3, i);
        Factory f;
        auto graphs = read_graph6_file(filename, f).graphs();
        for (Graph &G : graphs)
            output << is_edge_colourable_basic(G, 3);
        output << std::endl;
    }
    assert(output.str() == correctAnswer);

    Graph b1(read_graph6_line(":]dBgEfGdeIf`KiehoaGfJQknP_MoUcSnWdVmPYlXsT["));
    assert(test_removal(b1));
}
