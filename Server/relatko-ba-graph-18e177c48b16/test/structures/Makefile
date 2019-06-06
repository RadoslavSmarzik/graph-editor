CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)


all: swap_to_basic trail

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_trail


trail: compile_trail
	./trail.out
compile_trail:
	$(COMPILE_DBG) trail.cpp -o trail.out


clean:
	rm -rf *.out


.PHONY: clean all compile trail compile_trail
