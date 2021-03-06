App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  //Initialize Web3
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  //Initialize smart contract instance
  initContract: function() {
    $.getJSON("Grade.json", function(grade) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Grade = TruffleContract(grade);
      // Connect provider to interact with contract
      App.contracts.Grade.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  //Listen for events from smart contract
  listenForEvents: function() {
    App.contracts.Grade.deployed().then(function(instance2) {
      instance2.gradedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new grade is recorded
        App.render();
      });
    });
  },

  //Render page function
  render: function() {
    var gradeInstance2;
    //Target specific HTML tags in UI
    var loader = $("#loader");
    var content = $("#content");
    var alt = $("#alt-text");

    loader.show();
    content.hide();
    alt.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });

    // Load contract data
    App.contracts.Grade.deployed().then(function(instance2) {
      gradeInstance2 = instance2;
      return gradeInstance2.bmCount();
    }).then(function() {

      //Initialize containers to display student info
      var studentsName = $("#studentsName");
      studentsName.empty();

      //Initialize containers to display subjects
      var bahasaMalaysia = $('#bahasaMalaysia');

      var bahasaInggeris = $('#bahasaInggeris');

      var sejarah = $('#sejarah');

      var mathematics = $('#mathematics');

      var pendidikanMoral = $('#pendidikanMoral');

      var pendidikanIslam = $('#pendidikanIslam');

      var addMaths = $('#addMaths');

      var physics = $('#physics');

      var biology = $('#biology');

      var chemistry = $('#chemistry');

      var studentRemark = $('#studentRemark');

      //Pull and display student's name from blockchain
      gradeInstance2.bm(2).then(function(bm) {
        var name = bm[2];

        var nameTemplate = "<td>" + name + "</td>"
        studentsName.append(nameTemplate);

      })
      //Hide BM Input Box Once Graded
      gradeInstance2.bm(2).then(function(bm) {
        var graded = bm[4];

        if(graded) {
          bahasaMalaysia.hide();
        }

      })
      //Hide BI Input Box Once Graded
      gradeInstance2.bi(2).then(function(bi) {
        var graded = bi[4];

        if(graded) {
          bahasaInggeris.hide();
        }

      })
      //Hide SJ Input Box Once Graded
      gradeInstance2.sj(2).then(function(sj) {
        var graded = sj[4];

        if(graded) {
          sejarah.hide();
        }

      })
      //Hide MA Input Box Once Graded
      gradeInstance2.ma(2).then(function(ma) {
        var graded = ma[4];

        if(graded) {
          mathematics.hide();
        }

      })
      
      //Hide PM Input Box Once Graded
      gradeInstance2.pm(2).then(function(pm) {
        var graded = pm[4];
        var enrolled = pm[5];

        if(!enrolled){
          pendidikanMoral.hide();
        }
        if(graded) {
          pendidikanMoral.hide();
        }

      })
      //Hide PI Input Box Once Graded
      gradeInstance2.pi(2).then(function(pi) {
        var graded = pi[4];
        var enrolled = pi[5];

        if(!enrolled){
          pendidikanIslam.hide();
        }
        if(graded) {
          pendidikanIslam.hide();
        }

      })
      //Hide AM Input Box Once Graded
      gradeInstance2.am(2).then(function(am) {
        var graded = am[4];
        var enrolled = am[5];

        if(!enrolled){
          addMaths.hide();
        }
        if(graded) {
          addMaths.hide();
        }

      })
      //Hide PY Input Box Once Graded
      gradeInstance2.py(2).then(function(py) {
        var graded = py[4];
        var enrolled = py[5];

        if(!enrolled){
          physics.hide();
        }

        if(graded) {
          physics.hide();
        }

      })
      //Hide BL Input Box Once Graded
      gradeInstance2.bl(2).then(function(bl) {
        var graded = bl[4];
        var enrolled = bl[5];

        if(!enrolled){
          biology.hide();
        }

        if(graded) {
          biology.hide();
        }

      })
      //Hide CM Input Box Once Graded
      gradeInstance2.cm(2).then(function(cm) {
        var graded = cm[4];
        var enrolled = cm[5];

        if(!enrolled){
          chemistry.hide();
        }

        if(graded) {
          chemistry.hide();
        }

      })

      //Hide Remarks Input Box Once Submitted
      gradeInstance2.ss(2).then(function(ss) {
        var remarked = ss[5];

        if(remarked){
          studentRemark.hide();
        }

      })

      return gradeInstance2.finaliseGrade2(App.account);
  }).then(function(hasGraded) {
    //Check if grading finalised and update UI accordingly
    if(hasGraded){
      loader.hide();
      content.hide();
      alt.show()
    }
    else{
      loader.hide();
      content.show();
      alt.hide()
    }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  //Grade Bahasa Malaysia
  submitbmGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#bm-marks').val()
    //subject Identifier
    var subjectIdentifier = 1;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Bahasa Inggeris
  submitbiGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#bi-marks').val()
    //subject Identifier
    var subjectIdentifier = 2;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Sejarah
  submitsjGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#sj-marks').val()
    //subject Identifier
    var subjectIdentifier = 3;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Mathematics
  submitmaGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#ma-marks').val()
    //subject Identifier
    var subjectIdentifier = 4;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Pendidikan Moral
  submitpmGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#pm-marks').val()
    //subject Identifier
    var subjectIdentifier = 5;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Pendidikan Islam
  submitpiGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#pi-marks').val()
    //subject Identifier
    var subjectIdentifier = 6;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Additional Mathematics
  submitamGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#am-marks').val()
    //subject Identifier
    var subjectIdentifier = 7;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Physics
  submitpyGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#py-marks').val()
    //subject Identifier
    var subjectIdentifier = 8;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Biology
  submitblGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#bl-marks').val()
    //subject Identifier
    var subjectIdentifier = 9;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Grade Chemistry
  submitcmGrade: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var subjectMarks = $('#cm-marks').val()
    //subject Identifier
    var subjectIdentifier = 10;
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.grade(studentID, subjectMarks, subjectIdentifier, { from: App.account });
    }).then(function() {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Submit teacher's remark and finalise grading
  submitStudentRemark: function() {
    //student within subject instance
    var studentID = 2;
    //value of marks input
    var studentRemark = $('#student-Remark').val()
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.remarks(studentID, studentRemark, { from: App.account });
    }).then(function() {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  //Finalise student grading
  finaliseGrading: function() {
    var studentInstance = 2
    App.contracts.Grade.deployed().then(function(instance2) {
      return instance2.finaliseGrade(studentInstance, { from: App.account });
    }).then(function() {
      // Wait for grades to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});