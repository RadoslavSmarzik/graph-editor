CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS = -lstdc++fs -lcryptominisat5
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG 
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)


all: swap_to_basic cnf circular_colouring circumference colouring factors snarks solver solver_cmsat solver_bddmsat

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_cnf compile_circular_colouring compile_colouring compile_factors compile_snarks compile_solver compile_solver_cmsat compile_solver_bddmsat


cnf: compile_cnf
	./cnf.out
compile_cnf:
	$(COMPILE_DBG) test_cnf.cpp -o cnf.out

circular_colouring: compile_circular_colouring
	./circular_colouring.out
compile_circular_colouring:
	$(COMPILE_DBG) test_circular_colouring.cpp -o circular_colouring.out $(LDFLAGS)

circumference: compile_circumference
	./circumference.out
compile_circumference:
	$(COMPILE_DBG) test_circumference.cpp -o circumference.out $(LDFLAGS)

colouring: compile_colouring
	./colouring.out
compile_colouring:
	$(COMPILE_DBG) test_colouring.cpp -o colouring.out $(LDFLAGS)

factors: compile_factors
	./factors.out
compile_factors:
	$(COMPILE_DBG) test_factors.cpp -o factors.out $(LDFLAGS)

snarks: compile_snarks
	./snarks.out
compile_snarks:
	$(COMPILE_DBG) test_snarks.cpp -o snarks.out $(LDFLAGS)

solver: compile_solver
	./solver.out
compile_solver:
	$(COMPILE_DBG) test_solver.cpp -o solver.out $(LDFLAGS)

solver_cmsat: compile_solver_cmsat
	./solver_cmsat.out
compile_solver_cmsat:
	$(COMPILE_DBG) test_solver_cmsat.cpp -o solver_cmsat.out $(LDFLAGS)

solver_bddmsat: compile_solver_bddmsat
	./solver_bddmsat.out
compile_solver_bddmsat:
	$(COMPILE_DBG) test_solver_bddmsat.cpp -o solver_bddmsat.out $(LDFLAGS)


clean:
	rm -rf *.out


.PHONY: clean all compile
.PHONY: cnf circular_colouring circumference colouring factors snarks solver solver_cmsat solver_bddmsat
.PHONY: compile_cnf compile_circular_colouring compile_circumference compile_colouring compile_factors compile_snarks compile_solver compile_solver_cmsat compile_solver_bddmsat
