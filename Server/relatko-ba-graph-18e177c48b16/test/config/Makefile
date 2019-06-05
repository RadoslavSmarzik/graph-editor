CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic configuration

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_configuration


configuration: compile_configuration
	./configuration.out
compile_configuration:
	$(COMPILE_DBG) test_configuration.cpp -o configuration.out


clean:
	rm -rf *.out


.PHONY: clean all compile configuration compile_configuration
