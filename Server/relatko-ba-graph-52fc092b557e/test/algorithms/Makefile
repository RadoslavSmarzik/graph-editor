CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)


all: swap_to_basic cyclic_connectivity matchings paths
	$(MAKE) -C object_collection all
	$(MAKE) -C path_decomposition all
	$(MAKE) -C isomorphism all

swap_to_basic:
	cp implementation_basic.h implementation.h
	$(MAKE) -C object_collection swap_to_basic
	$(MAKE) -C path_decomposition swap_to_basic
	$(MAKE) -C isomorphism swap_to_basic

compile: compile_cyclic_connectivity compile_matchings compile_paths
	$(MAKE) -C object_collection compile
	$(MAKE) -C path_decomposition compile
	$(MAKE) -C isomorphism compile

cyclic_connectivity: compile_cyclic_connectivity
	./cyclic_connectivity.out
compile_cyclic_connectivity:
	$(COMPILE_DBG) test_cyclic_connectivity.cpp -o cyclic_connectivity.out $(LDFLAGS)

matchings: compile_matchings
	./matchings.out
compile_matchings:
	$(COMPILE_DBG) test_matchings.cpp -o matchings.out $(LDFLAGS)

paths: compile_paths
	./paths.out
compile_paths:
	$(COMPILE_DBG) test_paths.cpp -o paths.out $(LDFLAGS)


clean:
	rm -rf *.out
	$(MAKE) -C object_collection clean
	$(MAKE) -C path_decomposition clean
	$(MAKE) -C isomorphism clean


.PHONY: clean all compile
.PHONY: cyclic_connectivity matchings paths
.PHONY: compile_cyclic_connectivity compile_matchings compile_paths
