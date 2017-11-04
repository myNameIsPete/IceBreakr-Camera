(() => {

  const IceBreaker = {

    dom: {
      videoFeed: document.getElementById('videoFeed'),
      takeYourPhotoCheckBox: document.getElementById('takeYourPicture'),
      photoColumn: document.getElementById('col-photo'),
      form: document.getElementById('guestForm')
    },

    settings: {
      takeMyPhoto: false,
      config: {
        apiKey: 'AIzaSyCD3W_3ZoStwbxL4Ow-BY0q7chaxwXS0-M',
        authDomain: 'whos-here-c5928.firebaseapp.com',
        databaseURL: '//whos-here-c5928.firebaseio.com',
        projectId: 'whos-here-c5928',
        storageBucket: 'whos-here-c5928.appspot.com',
        messagingSenderId: '351367486002'
      }
    },

    init: () => {
      const {dom} = IceBreaker;

      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia;

      if (navigator.getUserMedia)
        navigator.getUserMedia({video: true}, IceBreaker.handleVideo, IceBreaker.handleVideoError);

      dom.takeYourPhotoCheckBox.addEventListener('click', IceBreaker.toggleVideoFeed);
      dom.form.addEventListener('submit', (e) => IceBreaker.processForm(e));
    },

    toggleVideoFeed: () => {
      const {settings} = IceBreaker;
      settings.takeMyPhoto = !settings.takeMyPhoto;
      const takeMyPhoto = settings.takeMyPhoto ? IceBreaker.slideInVideoFeed() : IceBreaker.slideOutVideoFeed();
    },

    slideInVideoFeed: () => {
      const {dom} = IceBreaker;
      if (dom.photoColumn.classList)
        dom.photoColumn.classList.add('in');
      else
        dom.photoColumn.className += ' in';
    },

    slideOutVideoFeed: () => {
      const {dom} = IceBreaker;
      if (dom.photoColumn.classList)
        dom.photoColumn.classList.remove('in');
      else
        dom.photoColumn.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },

    handleVideo: (stream) => {
      const {dom} = IceBreaker;
      dom.videoFeed.srcObject = stream;
    },

    handleVideoError: (error) => {
      console.error(error);
    },

    determineWhatImageToUse: () => {
      const {takeMyPhoto} = IceBreaker.settings;
      if (takeMyPhoto)
        return IceBreaker.takeSnapShot();
      else
        return IceBreaker.setDefaultProfileImage();
    },

    takeSnapShot: () => {
      const {dom} = IceBreaker;
      const videoWidth = dom.videoFeed.offsetWidth;
      const videoHeight = dom.videoFeed.offsetHeight;

      const canvas = document.createElement('canvas');
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(dom.videoFeed, 0, 0, videoWidth, videoHeight);

      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.id = 'guestPic';
      document.body.appendChild(img);

      return 'Pete Lupiano.jpg';
    },

    setDefaultProfileImage: () => {
      return 'default.jpg';
    },

    processForm: (event) => {
      event.preventDefault();
      const {takeMyPhoto} = IceBreaker.settings;
      const profileImageName = IceBreaker.determineWhatImageToUse();
      IceBreaker.createGuest();
      if (takeMyPhoto) {
        const guestName = document.getElementById('name').value;
        IceBreaker.postGuestImage(guestName);
      }
    },

    getAllFormData: () => {
      const {takeMyPhoto} = IceBreaker.settings;
      const guestData = {
        image: takeMyPhoto ? document.getElementById('name').value + '.jpg' : 'default.jpg',
        name: document.getElementById('name').value,
        interests: document.getElementById('interests').value,
        relation_to_tech: document.getElementById('description').value,
        category: document.getElementById('category').value
      };
      return guestData;
    },

    createGuest: () => {

      const formData = IceBreaker.getAllFormData();
      const {config} = IceBreaker.settings;

      firebase.initializeApp(config);
      const database = firebase.database();
      database.ref('guests').push(formData);
    },

    postGuestImage: (guestName) => {
      const img = document.getElementById('guestPic');
      const postData = {
        image: img.src,
        name: guestName
      };

      axios.post('/parse', postData)
        .then((response) => {
          alert('AWESOME! You should see your details on the board shortly.');
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };

  IceBreaker.init();

})();