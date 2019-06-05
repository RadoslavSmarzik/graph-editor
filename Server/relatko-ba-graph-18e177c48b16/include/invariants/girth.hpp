#ifndef BA_GRAPH_INVARIANTS_GIRTH_HPP
#define BA_GRAPH_INVARIANTS_GIRTH_HPP

#include <queue>
#include <iostream>

namespace ba_graph {

inline bool has_loop(const Graph &G)
{
    return (G.contains(RP::all(), IP::loop()));
}

bool has_parallel_edge(const Graph &G)
{
    for (auto &r : G) {
        std::set<Number> neighbours;
        for (auto &ii : r.list(!IP::loop())) {
            if (neighbours.find(ii->n2()) != neighbours.end())
                return true;
            else
                neighbours.insert(ii->n2());
        }
    }
    return false;
}

std::vector<std::vector<Location>> parallel_edges(const Graph &G)
{
    std::vector<std::vector<Location>> result;
    for (auto &ru : G) {
        Number u = ru.n();
        for (auto v : G[u].neighbours()) {
            if (v >= u) {
                auto edges = G[u].list(IP::n2(v) && IP::primary(), IT::l());
                if (edges.size() > 1)
                    result.push_back(edges);
            }
        }
    }
    return result;
}

inline bool is_simple(const Graph &G)
{
    return !has_loop(G) && !has_parallel_edge(G);
}

// (positive) cutoff is the maximum length of the cycle we are interested in
// if there are no cycles of length at most cutoff, empty result is returned
// cutoff of -1 means we will search the entire bfs tree
std::deque<Number> shortest_cycle(const Graph &G, Number w, int cutoff=-1)
{
    std::deque<Number> result;

    Rotation &rW = G[w];
    if (rW.degree() == 1) {
        return result; // empty
    } else if (rW.find(w) != rW.end()) { // we discovered a loop at w
        result.push_back(w);
        return result;
    }

    GraphNumberLabeling<int> dist(-1, G);
    GraphNumberLabeling<Number> parent(-1, G);

    dist.set(w, 0);
    std::queue<const Rotation *> q;
    q.push(&rW);
    int finalDist = -1;
    while (!q.empty()) {
        const Rotation &r = *q.front();
        // do not go further if anything found later will be longer then cutoff
        if ((cutoff % 2 == 1) && (dist[r.n()] > cutoff / 2)) break;
        if ((cutoff % 2 == 0) && (dist[r.n()] >= cutoff / 2)) break;
        // do not go further if anything found later
        // will be longer than the even cycle we already have
        if ((finalDist != -1) && (dist[r.n()] > finalDist)) break;

        for (auto &i : r) {
            Number neighbour = i.n2();
            if (neighbour == parent[r.n()]) continue; // skip the parent
            if (dist[neighbour] == -1) { // we found a new vertex
                dist.set(neighbour, dist[r.n()] + 1);
                parent.set(neighbour, r.n());
                q.push(&i.r2());
            } else if ((r.n() == w) && (parent[neighbour] == w)) {
                // we found a pair of parallel edges between w and neighbour
                result.push_back(r.n()); result.push_back(w);
                return result;
            } else if ((neighbour != parent[r.n()])) {
                // we found a vertex already seen, thus a cycle
                // but we must be careful, it might not pass through w
                if ((finalDist != -1) && (dist[neighbour] > dist[r.n()]))
                    continue; // just another even cycle as long as we already have
                // we found an odd cycle with length 2*dist[r.n()]+1 (if so, we can return)
                // or an even cycle with length 2*dist[r.n()]+2,
                // but there might be an odd cycle of length 2d+1
                // so we have to finish checking that
                Number p1 = r.n(), p2 = neighbour;
                if (dist[p1] > dist[p2]) std::swap(p1, p2);
                if (dist[p2] > dist[p1]) {
                    if (cutoff == 2 * dist[p1] + 1) continue;
                        // we are not interested in the even cycle we have found because its length is cutoff + 1
                    p2 = parent[p2];
                }
                while (p1 != p2) {
                    p1 = parent[p1];
                    p2 = parent[p2];
                }
                if (p1 == w) { // also p2 = w, so w is contained in this cycle
                    finalDist = dist[r.n()]; // no need to go to further levels of bfs tree
                    // now store the cycle
                    result.clear();
                    Number p1 = r.n(), p2 = neighbour;
                    if (dist[p1] > dist[p2]) std::swap(p1, p2);
                    if (dist[p2] > dist[p1]) {
                        result.push_back(p2); // move from the neighbour one level up
                        p2 = parent[p2];
                    }
                    while (p1 != p2) {
                        result.push_back(p1);
                        result.push_front(p2);
                        p1 = parent[p1];
                        p2 = parent[p2];
                    }
                    result.push_front(w);
                }
                if (dist[neighbour] == dist[r.n()])
                    return result; // the odd cycle case
            }
        }
        q.pop();
    }
    return result;
}

int shortest_cycle_length(const Graph &G, Number w, int cutoff=-1)
{
    auto cycle = shortest_cycle(G, w, cutoff);
    return (cycle.size() == 0) ? -1 : cycle.size();
}

// if given a positive cutoff, only cycles of length at most cutoff will be searched for
int girth(const Graph &G, int cutoff=-1)
{
    if (cutoff == 1)
        return (has_loop(G)) ? 1 : -1;
    if (cutoff == 2) {
        if (has_loop(G)) return 1;
        if (has_parallel_edge(G)) return 2;
        return -1;
    }

    int g = G.order() + 1;
    for (auto &r : G) {
        int length = shortest_cycle_length(G, r.n(), std::min(g, cutoff));
        if ((length != -1) && (length < g))
            g = length;
    }
    if (g == G.order() + 1)
        return -1;
    else
        return g;
}

} // namespace ba_graph

#endif
