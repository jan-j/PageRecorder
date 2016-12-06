const createManifest = function (env) {
    let name = 'PageRecorder';

    if (env !== 'production') {
        name += 'Dev';
    }

    return {
        manifest_version: 2,
        name: name,
        version: '0.1.0',
        description: 'PageRecorder allows you to capture video of tab content and your interaction with it',
        background: {
            page: 'background.html'
        },
        browser_action: {
            default_popup: 'popup.html'
        },
        permissions: [
            'activeTab',
            'tabCapture',
        ],
        icons: {
            16: 'assets/images/icon16.png',
            48: 'assets/images/icon48.png',
            128: 'assets/images/icon128.png'
        }
    };
};

module.exports = createManifest;