
/* 
 * File:   main.cpp
 * Author: Filip
 *
 * 
 */

/*#include <snarks/colouring_pd.hpp>
#include <graphs/snarks.hpp>
#include <random/random_graphs.hpp>
#include <path_decomposition/shortest_path_heuristic.hpp>
#include <snarks/colouring_pd.hpp>*/ 

#include <basic_impl.hpp>
#include <invariants.hpp>
#include <graphs.hpp>
#include <operations.hpp>
#include <io.hpp>
//#include <algorithms/cyclic_connectivity.hpp>//

#include <config/configuration.hpp>
#include <util/json.hpp>

#include "httprequestparser.h"
#include "request.h"

#include <cassert>
#include <iomanip>

#include <sstream>
#include <stdexcept>
#include <unistd.h> 
#include <stdio.h> 
#include <sys/socket.h> 
#include <stdlib.h> 
#include <netinet/in.h> 
#include <map>
#include <vector>
#include <string.h> 
#include <iostream> 

#define PORT 8080 

using namespace std;
using namespace ba_graph;
using namespace httpparser;

struct Response { 																		//
    int versionMajor = 1;
    int versionMinor = 1;
    unsigned int statusCode1 = 200;
    unsigned int statusCode2 = 404;
    std::string status1 = "OK";
    std::string status2 = "NOT FOUND";
    std::vector<pair<std::string, std::string>> headers = {{ "Access-Control-Allow-Origin", "http://localhost:4200"}};
};

std::string make_response(int num, std::string cType, std::string content = "") {
    Response res;
    if (cType == "plain") {
        res.headers.push_back({"Content-Type", "text/plain"});
    } else if (cType == "json") {
        res.headers.push_back({"Content-Type", "application/json"});
    } else if (cType == "html") {
        res.headers.push_back({"Content-Type", "text/html"});
    }
    std::stringstream stream;
    if (num == 1) {
        stream << "HTTPS/" << res.versionMajor << "." << res.versionMinor
               << " " << res.statusCode1 << " " << res.status1 << "\n";
        
		for (pair<std::string, std::string> i : res.headers) {
            stream << i.first << ": " << i.second << "\n";
        }
        stream << "\n" << content;
    } else if (num == 2) {
        stream << "HTTPS/" << res.versionMajor << "." << res.versionMinor
               << " " << res.statusCode2 << " " << res.status2 << "\n";
        
		for (pair<std::string, std::string> i : res.headers) {
            stream << i.first << ": " << i.second << "\n";
        }
        stream << "\n" << "<html><body>NOT FOUND</body></html>"; 					//treba aj davat body? ,content
    }
    return stream.str();
}

json datab_mult() {
    std::ifstream in("array_of_multipoles.txt");
    json m;
    in >> m;
    in.close();
    return m;
}

class GraphBuilder { //nefunguje gtools.h

    Graph g = createG(); //nefunguje, treba dat vytvorit ten graf az v tom make_graph alebo to uz sparsovat v tej funkcii a potom poslat string
    json info;
    json m;
    std::map<int, Number> map_of_vert;
    std::map<pair<int, std::string>, Number> map_of_mult;

public:
	GraphBuilder(json data) {
        m = datab_mult();
        info = data;
    }

    Graph & make_graph() {
        int c = 0;
        for (auto& e : info["vertices"]) {
            c++;
            int v = std::stoi(e.get<std::string>());
            map_of_vert[v] = c;
            addV(g, c);
        }
        for (auto& e : info["multipoles"]) {
            for (auto& j : m) {
                if (e["name"] == j["name"]) {
                    Graph multipol = read_sparse6(j["underlying_graph"].get<std::string>().begin(), j["underlying_graph"].get<std::string>().end());
                    int min_n = min_offset(g);
                    add_graph(g, multipol, min_n);
                    int id = std::stoi(e["id"].get<std::string>());
                    for (auto& k : j["dangling_edges_mapping"]) {
                        for (auto& l : k.items()) {
                            //c++;
                            int value = std::stoi(l.value().get<std::string>());
                            map_of_mult[{ id, l.key()}] = min_n + value; 									//c
                        }
                    }
                    break;
                }
            }
        }
        for (auto& e : info["edges"]) {
            if (e["first"]["type"] == "multipol" && e["second"]["type"] == "vertex") {
                int index1 = std::stoi(e["first"]["id"].get<std::string>());
                std::string index2 = e["first"]["dangling_edge"].get<std::string>();
                Number vertex1 = map_of_vert[std::stoi(e["second"]["id"].get<std::string>())];
                Number vertex2 = map_of_mult[{index1, index2}];
                identify_vertices(g, vertex1, vertex2);
            } else if (e["second"]["type"] == "multipol" && e["first"]["type"] == "vertex") {
                int index1 = std::stoi(e["second"]["id"].get<std::string>());
                std::string index2 = e["second"]["dangling_edge"].get<std::string>();
                Number vertex1 = map_of_vert[std::stoi(e["first"]["id"].get<std::string>())];
                Number vertex2 = map_of_mult[{index1, index2}];
                identify_vertices(g, vertex1, vertex2);
            } else if (e["first"]["type"] == "multipol" && e["second"]["type"] == "multipol") {
                int index1a = std::stoi(e["first"]["id"].get<std::string>());
                std::string index2a = e["first"]["dangling_edge"].get<std::string>();
                int index1b = std::stoi(e["second"]["id"].get<std::string>());
                std::string index2b = e["second"]["dangling_edge"].get<std::string>();
                Number vertex1 = map_of_mult[{index1a, index2a}];
                Number vertex2 = map_of_mult[{index1b, index2b}];
                identify_vertices(g, vertex1, vertex2);
                suppress_vertex(g, vertex1);
            } else if (e["first"]["type"] == "vertex" && e["second"]["type"] == "vertex") {
                int v1 = std::stoi(e["first"]["id"].get<std::string>());
                int v2 = std::stoi(e["second"]["id"].get<std::string>());
                addE(g, Location(map_of_vert[v1], map_of_vert[v2]));
            } else {
                throw std::invalid_argument("received bad type");
            }
        }
        return g;
    }
};

int main(int argc, char const *argv[]) {

    int server_fd, new_socket;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof (address);
    char buffer[800000] = {0};

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *) &address, sizeof (address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    if (listen(server_fd, 3) < 0) { //pocuva az 3 requesty naraz
        perror("listen");
        exit(EXIT_FAILURE);
    }

    while (true) { // 

        if ((new_socket = accept(server_fd, (struct sockaddr *) &address, (socklen_t*) & addrlen)) < 0) {
            perror("accept");
            exit(EXIT_FAILURE);
        }
	
        read(new_socket, buffer, 800000);
        printf("%s\n", buffer); //

        Request request;
        HttpRequestParser parser;
        HttpRequestParser::ParseResult res = parser.parse(request, buffer, buffer + sizeof (buffer));

        if (res == HttpRequestParser::ParsingCompleted) {				//nechat alebo odstranit

            std::cout << request.method << std::endl; //
            std::cout << request.uri << std::endl; //

            std::string data(request.content.begin(), request.content.end());
            std::cout << data << std::endl; //

            if (request.method == "POST") {
                if (request.uri.compare(0, 6, "/graph") == 0) {
                    /*json info = json::parse(data);
                    GraphBuilder gb(info);
                    try {
                        Graph g = gb.make_graph();
                        std::string s =	write_sparse6(g);
		
                        std::string str = make_response(1, "plain", s);
                        const char * resp = str.c_str();
                        send(new_socket, resp, strlen(resp), 0);
						close(new_socket);
                    }
                    catch(const std::invalid_argument& e) {
                        std::string str = make_response(2, "html");
                        const char * resp = str.c_str();
                        send(new_socket, resp, strlen(resp), 0);
						close(new_socket);						
                    }*/
                } else {
                    string str = make_response(2, "html");
                    const char * resp = str.c_str();
                    send(new_socket, resp, strlen(resp), 0);
					close(new_socket);
                }
            } else if (request.method == "GET") {
                if (request.uri.compare(0, 9, "/multipol") == 0) {
                    json m = datab_mult();
                    std::string s = m.dump();

                    std::string str = make_response(1, "json", s);
                    const char * resp = str.c_str();
                    send(new_socket, resp, strlen(resp), 0);
					close(new_socket);
                } else if (request.uri.compare(0, 11, "/invariants") == 0) {
                    Graph g = read_sparse6(data.begin(), data.end());
                    json invariants;
                    invariants["girth"] = girth(g); //netreba to dat do uvodzoviek ?
                    invariants["max_deg"] = max_deg(g);
                    invariants["min_deg"] = min_deg(g);
                    /*if(invariants["max_deg"] == 3 && invariants["min_deg"] == 3){
						invariants["cyclic_connectivity"] = cyclic_connectivity(g);
                    }	*/

                    std::string s = invariants.dump();
                    std::string str = make_response(1, "json", s); // typ json ?
                    const char * resp = str.c_str();
                    send(new_socket, resp, strlen(resp), 0);
					close(new_socket);
                } else {
                    string str = make_response(2, "html");
                    const char * resp = str.c_str();
                    send(new_socket, resp, strlen(resp), 0);
					close(new_socket);
                }
            }
        } else {
            string str = make_response(2, "html");					
            const char * resp = str.c_str();
            send(new_socket, resp, strlen(resp), 0);
			close(new_socket);
        }
    }//
    return 0;
}





