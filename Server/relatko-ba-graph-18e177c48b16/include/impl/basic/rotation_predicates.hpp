#ifndef BA_GRAPH_GRAPH_PREDICATES_H
#define BA_GRAPH_GRAPH_PREDICATES_H

#include "basic_objects.hpp"
#include "incidence.h"
#include "rotation.h"

namespace ba_graph {

namespace RP {

class all {
public:
    bool operator() (const Rotation &) {return true;};
};

class degree {
    int deg_;
public:
    degree(int deg): deg_(deg) {}
    bool operator() (const Rotation &a) { return a.degree()==deg_; }
};


template<typename T> class  RP {
public:
    RP(const T &h);
};

template<> class RP<Number> {
    Number n_;
public:
    RP(Number n): n_(n) {}
    bool operator() (const Rotation &a) { return a.n()==n_; }
};

template<> class RP<Vertex> {
    Vertex v_;
public:
    RP(Vertex v): v_(v) {}
    bool operator() (const Rotation &a) { return a.v()==v_; }
};


class n {
    Number n_;
public:
    n(Number n): n_(n) {}
    bool operator() (const Rotation &a) { return a.n()==n_; }
};
class v {
    Vertex v_;
public:
    v(Vertex v): v_(v) {}
    bool operator() (const Rotation &a) { return a.v()==v_; }
};


//spies
class count {
    int cnt_;
public:
    count() :cnt_(0) {}
    bool operator() (const Rotation &) {cnt_++; return true;};
    int get_count() const {return cnt_;}
};


} //end namespace RP


namespace RT {

class iterator {
public:
    typedef RotationIterator ReturnType;
    iterator() {}
    ReturnType operator() (RotationIterator it) { return it; }
};

class n {
public:
    typedef Number ReturnType;
    n() {}
    ReturnType operator() (RotationIterator it) { return it->n(); }
};

class v {
public:
    typedef Vertex ReturnType;
    v() {}
    ReturnType operator() (RotationIterator it) { return it->v(); }
};
} //end namespace PT


namespace RC
{
    class n {
    public:
        n() {}
        bool operator() (RotationIterator it1, RotationIterator it2) { return it1->n()<it2->n(); }
    };
    class degree {
    public:
        degree() {}
        bool operator() (RotationIterator it1, RotationIterator it2) { return it1->degree()<it2->degree(); }
    };

    template<RotationComparator C1, RotationComparator C2>
    class pair {
        C1 c1_;
        C2 c2_;
    public:
        pair(const C1 &c1, const C2 &c2) : c1_(c1), c2_(c2) {}
        bool operator() (RotationIterator it1, RotationIterator it2) {
            if (c1_(it1,it2)) return true;
            if (c1_(it2,it1)) return false;
            if (c2_(it1,it2)) return true;
            return false;
        }
    };
}


template<typename T>
inline decltype(auto) get_rp(T &&l)
        requires RotationPredicate<T> || GraphLocatable<T> {
    if constexpr (RotationPredicate<T>) return std::forward<T>(l);
    else return RP::RP(l);
}


}  // namespace end
#endif
