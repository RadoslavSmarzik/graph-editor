CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic print_nice graph6 oldBA

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_print_nice compile_graph6 compile_oldBA


print_nice: compile_print_nice
	./print_nice.out
compile_print_nice:
	$(COMPILE_DBG) test_print_nice.cpp -o print_nice.out

graph6: compile_graph6
	./graph6.out
compile_graph6:
	$(COMPILE_DBG) test_graph6.cpp -o graph6.out

oldBA: compile_oldBA
	./oldBA.out
compile_oldBA:
	$(COMPILE_DBG) test_oldBA.cpp -o oldBA.out


clean:
	rm -rf *.out


.PHONY: clean all compile print_nice compile_print_nice oldBA compile_oldBA graph6 compile_graph6
