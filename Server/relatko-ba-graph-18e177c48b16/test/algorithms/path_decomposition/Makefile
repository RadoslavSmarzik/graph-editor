CFLAGS = -std=c++17 -fconcepts -I../../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)
COMPILE_DBG_CMS = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic path_decomposition shortest_path_heuristic

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_path_decomposition compile_shortest_path_heuristic


path_decomposition: compile_path_decomposition
	./path_decomposition.out
compile_path_decomposition:
	$(COMPILE_DBG) test_path_decomposition.cpp -o path_decomposition.out

shortest_path_heuristic: compile_shortest_path_heuristic
	./shortest_path_heuristic.out
compile_shortest_path_heuristic:
	$(COMPILE_DBG) test_shortest_path_heuristic.cpp -o shortest_path_heuristic.out


clean:
	rm -rf *.out


.PHONY: clean all compile path_decomposition compile_path_decomposition shortest_path_heuristic compile_shortest_path_heuristic
