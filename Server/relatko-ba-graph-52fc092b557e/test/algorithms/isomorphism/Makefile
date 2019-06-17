CFLAGS = -std=c++17 -fconcepts -I../../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)


all: swap_to_basic isomorphism isomorphism_nauty

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_cyclic_connectivity compile_isomorphism compile_matchings compile_isomorphism_nauty

isomorphism: compile_isomorphism
	./isomorphism.out
compile_isomorphism:
	$(COMPILE_DBG) test_isomorphism.cpp -o isomorphism.out $(LDFLAGS)

isomorphism_nauty: compile_isomorphism_nauty
	./isomorphism_nauty.out
compile_isomorphism_nauty:
	$(COMPILE_DBG) -I/usr/include/nauty test_isomorphism_nauty.cpp -o isomorphism_nauty.out $(LDFLAGS) -lnauty


clean:
	rm -rf *.out


.PHONY: clean all compile
.PHONY: isomorphism isomorphism_nauty
.PHONY: compile_isomorphism compile_isomorphism_nauty
