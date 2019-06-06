CFLAGS = -std=c++17 -fconcepts -I../../../include
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG -D_GLIBCXX_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)
COMPILE_DBG_CMS = $(CXX) $(CFLAGS) $(LDFLAGS) $(DBGFLAGS)


all: swap_to_basic object_collection

swap_to_basic:
	cp implementation_basic.h implementation.h

compile: compile_object_collection


object_collection: compile_object_collection
	./object_collection.out
compile_object_collection:
	$(COMPILE_DBG) -I /usr/include/nauty test_object_collection.cpp -o object_collection.out -lnauty


clean:
	rm -rf *.out


.PHONY: clean all compile object_collection compile_object_collection
