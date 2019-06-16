CFLAGS = -std=c++17 -fconcepts -fopenmp -I../../include
LDFLAGS = -lstdc++fs
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)


all: swap_to_basic math parallel system

compile: compile_math compile_parallel compile_system

swap_to_basic:
	cp implementation_basic.h implementation.h


math: compile_math
	./math.out
compile_math:
	$(COMPILE_DBG) test_math.cpp -o math.out
	
parallel: compile_parallel
	./parallel.out
compile_parallel:
	$(COMPILE_DBG) test_parallel.cpp -o parallel.out

system: compile_system
	./system.out
compile_system:
	$(COMPILE_DBG) test_system.cpp -o system.out $(LDFLAGS)

clean:
	rm -rf *.out


.PHONY: clean all math parallel system compile compile_math compile_parallel compile_system
