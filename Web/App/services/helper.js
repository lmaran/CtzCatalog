app.factory('helper', [function () {

    var factory = {};

    factory.getPrimaryThumbImageUrl = function (images) {
        if (!images || images.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var image = images[0]; // primary image
        if (!image.sizes || image.sizes.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var fileNameWithoutExtension = image.name.substring(0, image.name.indexOf('.'));
        var fileExtensionWithDot = image.name.substring(image.name.indexOf('.'));
        var sizeLabel = image.sizes[0];
        return image.rootUrl + '/' + fileNameWithoutExtension + '-' + sizeLabel + fileExtensionWithDot;
    };

    factory.getThumbImageUrl = function (image) {
        if (!image || !image.sizes || image.sizes.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var fileNameWithoutExtension = image.name.substring(0, image.name.indexOf('.'));
        var fileExtensionWithDot = image.name.substring(image.name.indexOf('.'));
        var sizeLabel = image.sizes[0];
        return image.rootUrl + '/' + fileNameWithoutExtension + '-' + sizeLabel + fileExtensionWithDot;
    }

    factory.getLargeImageUrl = function (image) {
        if (!image || !image.sizes || image.sizes.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var fileNameWithoutExtension = image.name.substring(0, image.name.indexOf('.'));
        var fileExtensionWithDot = image.name.substring(image.name.indexOf('.'));
        var sizeLabel = image.sizes.length > 1 ? image.sizes[1] : image.sizes[0];
        return image.rootUrl + '/' + fileNameWithoutExtension + '-' + sizeLabel + fileExtensionWithDot;
    }


    // helper functions
    factory.getIndexInArray = function (array, property, value) {
        return getIndexInArray(array, property, value);
    }

    factory.deleteItemInArray = function(array, property, value) {
        var idx = getIndexInArray(array, property, value);
        if (idx != -1)
            array.splice(idx, 1);
        else
            alert("Can't delete! Key or value not found");
    }

    factory.getItemInArray = function(array, property, value) {
        // find object in array (objects with one level depth)
        var item = undefined;
        var idx = getIndexInArray(array, property, value)
        if (idx != -1)
            item = array[idx];
        return item;
    }

    function getIndexInArray(array, property, value) {
        var length = array.length;
        for (var i = 0, len = length; i < len; i++) {
            if (array[i][property] === value) return i;
        }
        return -1;
    }

    return factory;
}]);