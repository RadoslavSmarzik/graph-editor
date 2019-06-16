CFLAGS = -std=c++17 -fconcepts -I../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)
COMPILE_DBG_CMS = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic colouring products reductions superposition colouring_cvd colouring_kowalik colouring_nagy colouring_bit_array colouring_pd

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_colouring compile_products compile_reductions compile_superposition compile_colouring_cvd compile_colouring_kowalik compile_colouring_nagy compile_colouring_bit_array compile_colouring_pd


colouring: compile_colouring
	./colouring.out
compile_colouring:
	$(COMPILE_DBG_CMS) test_colouring.cpp -o colouring.out

products: compile_products
	./products.out
compile_products:
	$(COMPILE_DBG_CMS) test_products.cpp -o products.out

reductions: compile_reductions
	./reductions.out
compile_reductions:
	$(COMPILE_DBG_CMS) test_reductions.cpp -o reductions.out

superposition: compile_superposition
	./superposition.out
compile_superposition:
	$(COMPILE_DBG_CMS) test_superposition.cpp -o superposition.out

colouring_cvd: compile_colouring_cvd
	./colouring_cvd.out
compile_colouring_cvd:
	$(COMPILE_DBG_CMS) test_colouring_cvd.cpp -o colouring_cvd.out

colouring_kowalik: compile_colouring_kowalik
	./colouring_kowalik.out
compile_colouring_kowalik:
	$(COMPILE_DBG_CMS) test_colouring_kowalik.cpp -o colouring_kowalik.out

colouring_nagy: compile_colouring_nagy
	./colouring_nagy.out
compile_colouring_nagy:
	$(COMPILE_DBG) test_colouring_nagy.cpp -o colouring_nagy.out

colouring_bit_array: compile_colouring_bit_array
	./colouring_bit_array.out
compile_colouring_bit_array:
	$(COMPILE_DBG) test_colouring_bit_array.cpp -o colouring_bit_array.out

colouring_pd: compile_colouring_pd
	./colouring_pd.out
compile_colouring_pd:
	$(COMPILE_DBG) test_colouring_pd.cpp -o colouring_pd.out

clean:
	rm -rf *.out


.PHONY: clean all compile colouring compile_colouring products compile_products reductions compile_reductions superposition compile_superposition colouring_kowalik compile_colouring_kowalik colouring_cvd compile_colouring_cvd colouring_nagy compile_colouring_nagy colouring_bit_array compile_colouring_bit_array colouring_pd compile_colouring_pd
