CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic random_graphs renumber

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_random_graphs compile_renumber


random_graphs: compile_random_graphs
	./random_graphs.out
compile_random_graphs:
	$(COMPILE_DBG) test_random_graphs.cpp -o random_graphs.out

renumber: compile_renumber
	./renumber.out
compile_renumber:
	$(COMPILE_DBG) test_renumber.cpp -o renumber.out


clean:
	rm -rf *.out


.PHONY: clean all compile random_graphs compile_random_graphs renumber compile_renumber
