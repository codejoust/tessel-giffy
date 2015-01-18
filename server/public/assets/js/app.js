$(function(){ 

	var imageContainer = $('#imageBucket');
	var imageLatest = $('#imageLatest');
	var imageLatestBase = imageLatest.attr('src');


	function processNewImages(newImages) {
		newImages.forEach(function(img) {
			insertNewImage(img);
		})
	}

	function insertNewImage(img) {
		$('<img class="sm" src="imgs/'+img+'" />').on('error', function(img) {
			$(this).remove();
		}).prependTo(imageContainer);
	}

	function reloadLatestImage() {
		imageLatest.attr('src', imageLatestBase + '?q=' + new Date().getTime());
	}

	function addNewImage(newImageUrl) {
		imageLatest.attr('src', 'imgs/' + newImageUrl)
		insertNewImage(newImageUrl);
	}

	function setupSocket() {
		var socket = io();
		socket.on('init', function(data){
			imageContainer.empty(); 
			console.log('init!');
			if ('files' in data) { 
				processNewImages(data.files) 
			} 
		})
	    socket.on('newImage', function(newImage) { 
	    	console.log('newImage!');
	    	addNewImage(newImage); 
	    });
	    socket.on('reloadPreview', function(shouldReload) {
	    	console.log('reloadPreview');
	    	reloadLatestImage();
	    })

	}

	setupSocket();

})