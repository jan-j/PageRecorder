const createManifest = function (env) {
    const manifest = {
        manifest_version: 2,
        name: 'PageRecorder',
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

    if (env !== 'production') {
        manifest.name += 'Dev';

        manifest.content_security_policy = "script-src 'self' 'unsafe-eval' https://localhost:3001; object-src 'self';";
    }

    return manifest;
};

module.exports = createManifest;