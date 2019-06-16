CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic basic bipartite snarks stored_graphs

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_basic compile_bipartite compile_snarks compile_stored_graphs


basic: compile_basic
	./basic.out
compile_basic:
	$(COMPILE_DBG) test_basic.cpp -o basic.out

bipartite: compile_bipartite
	./bipartite.out
compile_bipartite:
	$(COMPILE_DBG) test_bipartite.cpp -o bipartite.out

snarks: compile_snarks
	./snarks.out
compile_snarks:
	$(COMPILE_DBG) test_snarks.cpp -o snarks.out

stored_graphs: compile_stored_graphs
	./stored_graphs.out
compile_stored_graphs:
	$(COMPILE_DBG) test_stored_graphs.cpp -o stored_graphs.out

trees: compile_trees
	./trees.out
compile_trees:
	$(COMPILE_DBG) test_trees.cpp -o trees.out


clean:
	rm -rf *.out


.PHONY: clean all compile swap_to_basic
.PHONY: basic bipartite snarks stored_graphs trees
.PHONY: compile_basic compile_bipartite compile_snarks compile_stored_graphs compile_trees
