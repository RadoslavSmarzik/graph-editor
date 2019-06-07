CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic common_multipoles join multipoles

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_join compile_multipoles compile_common_multipoles


join: compile_join
	./join.out
compile_join:
	$(COMPILE_DBG) test_join.cpp -o join.out

multipoles: compile_multipoles
	./multipoles.out
compile_multipoles:
	$(COMPILE_DBG) test_multipoles.cpp -o multipoles.out

common_multipoles: compile_common_multipoles
	./common_multipoles.out
compile_common_multipoles:
	$(COMPILE_DBG) test_common_multipoles.cpp -o common_multipoles.out


clean:
	rm -rf *.out


.PHONY: clean all compile multipoles compile_multipoles join compile_join
