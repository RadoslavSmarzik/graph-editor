
all:
	$(MAKE) -C algorithms all
	$(MAKE) -C config all
	$(MAKE) -C graphs all
	$(MAKE) -C invariants all
	$(MAKE) -C io all
	$(MAKE) -C multipoles all
	$(MAKE) -C operations all
	$(MAKE) -C random all
	$(MAKE) -C sat all
	$(MAKE) -C snarks all
#	$(MAKE) -C structures all #FIXME
	$(MAKE) -C util all

clean:
	$(MAKE) -C algorithms clean
	$(MAKE) -C config clean
	$(MAKE) -C graphs clean
	$(MAKE) -C invariants clean
	$(MAKE) -C io clean
	$(MAKE) -C multipoles clean
	$(MAKE) -C operations clean
	$(MAKE) -C random clean
	$(MAKE) -C sat clean
	$(MAKE) -C snarks clean
#	$(MAKE) -C structures clean #FIXME
	$(MAKE) -C util clean
	rm -rf headers.txt

includes:
	./test_includes.sh
	
list_headers:
	./test_list_headers.sh | grep -v "include/impl" > headers.txt
	cat headers.txt

.PHONY: all includes
