CFLAGS = -std=c++17 -fconcepts -IC:\Users\Filip\Desktop\roc_projekt\Server\relatko-ba-graph-18e177c48b16\include
#LDFLAGS = -lcryptominisat5
LDFLAGS =
DBGFLAGS = -g -O0 -pedantic -Wall -Wextra -DBA_GRAPH_DEBUG
COMPILE_DBG = $(CXX) $(CFLAGS) $(DBGFLAGS)
COMPILE = $(CXX) $(CFLAGS) -DNDEBUG -O3

all: server


server:
	$(COMPILE) main.cpp -o server $(LDFLAGS)

server_dbg:
	$(COMPILE_DBG) main.cpp -o server $(LDFLAGS)


clean:
	rm -rf *.out


.PHONY: clean all server server_dbg