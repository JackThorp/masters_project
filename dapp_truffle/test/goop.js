contract('Goop', function(accounts) {
  it("should assert true", function(done) {
    var goop = Goop.at(Goop.deployed_address);
    assert.isTrue(true);
    done();
  });

  it("should return 5", function(done) {
    var goop = Goop.at(Goop.deployed_address);
    goop.getFive.call().then(function(res) {
    }).then(done).catch(done);
  });

  it("should add organisation and return id", function(done) {
    
    var goop = Goop.at(Goop.deployed_address);
    goop.newOrganisation("imperial")
    .then(function(id) {
      return goop.newOrganisation("fairmondo");
    })
    .then(function(id) {
    })
    .then(done).catch(done);
  });
});
