CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic connectivity colouring degree distance girth

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_connectivity compile_colouring compile_degree compile_distance compile_girth


connectivity: compile_connectivity
	./connectivity.out
compile_connectivity:
	$(COMPILE_DBG) test_connectivity.cpp -o connectivity.out

colouring: compile_colouring
	./colouring.out
compile_colouring:
	$(COMPILE_DBG) test_colouring.cpp -o colouring.out

degree: compile_degree
	./degree.out
compile_degree:
	$(COMPILE_DBG) test_degree.cpp -o degree.out

distance: compile_distance
	./distance.out
compile_distance:
	$(COMPILE_DBG) test_distance.cpp -o distance.out

girth: compile_girth
	./girth.out
compile_girth:
	$(COMPILE_DBG) test_girth.cpp -o girth.out



clean:
	rm -rf *.out


.PHONY: clean all compile connectivity compile_connectivity degree compile_degree distance compile_distance colouring compile_colouring
