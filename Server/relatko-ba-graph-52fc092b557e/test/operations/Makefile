CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic add_graph basic copies line_graph simplification test undo

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_add_graph compile_basic compile_copies compile_line_graph compile_simplification compile_test compile_undo


add_graph: compile_add_graph
	./add_graph.out
compile_add_graph:
	$(COMPILE_DBG) test_add_graph.cpp -o add_graph.out

basic: compile_basic
	./basic.out
compile_basic:
	$(COMPILE_DBG) test_basic.cpp -o basic.out

copies: compile_copies
	./copies.out
compile_copies:
	$(COMPILE_DBG) test_copies.cpp -o copies.out

line_graph: compile_line_graph
	./line_graph.out
compile_line_graph:
	$(COMPILE_DBG) test_line_graph.cpp -o line_graph.out

simplification: compile_simplification
	./simplification.out
compile_simplification:
	$(COMPILE_DBG) test_simplification.cpp -o simplification.out

test: compile_test
	./test.out
compile_test:
	$(COMPILE_DBG) test.cpp -o test.out

undo: compile_undo
	./undo.out
compile_undo:
	$(COMPILE_DBG) test_undo.cpp -o undo.out

clean:
	rm -rf *.out


.PHONY: clean all compile add_graph basic copies line_graph simplification test undo swap_to_basic compile_add_graph compile_basic compile_copies compile_line_graph compile_simplification compile_test compile_undo
