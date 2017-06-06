define([
    'jquery',
    'underscore',
    'cslsClient'
], function(
    $,
    _,
    CrossStorageClient
) {

    // global QGCIDM NEO variables and functions
    $.qgcidm = {
        _lock: null,
        _avatar: [],
        _onLogin: $.Callbacks('onLogin'),
        _onLogout: $.Callbacks('onLogout'),
        _home: window.location.href,
        _id_token : 'id_token',
        _timeout: 1200000, // 20 minutes, 20 * 60 * 1000 ms
        _timer: null,
        _scope: null,
        _storage: null,

        profile: {},

        config: {
            home: '',
            domain: '',
            clientID : '',
            level: 'Level_1',
            wrapped: false,
            returnTo: window.location.href,
            myAccountURL : ''
        },

        levels: {
            'Level_1' : 'CIDM-AAL1',
            'Level_2' : 'CIDM-AAL2'
        },

        getToken: function(callback) {
            $.qgcidm._storage.onConnect()
                .then(function() {
                    return $.qgcidm._storage.get($.qgcidm._id_token);
                })
                .then(function(value) {
                    callback(value);
                })
                ['catch'](function(err) {
            });
        },

        setToken: function(value,callback) {
            $.qgcidm._storage.onConnect()
                .then(function() {
                    return $.qgcidm._storage.set($.qgcidm._id_token,value);
                })
                .then(callback)
                ['catch'](function(err) {
            });
        },

        delToken: function(callback) {
            $.qgcidm._storage.onConnect()
                .then(function() {
                    return $.qgcidm._storage.del($.qgcidm._id_token);
                })
                .then(callback)
                ['catch'](function(err) {
            });

        },

        initialise: function(config) {
            if (config) {
                _.each(config, function(val,key) {
                    $.qgcidm.config[key] = val;
                });
            }

            $.qgcidm._scope = 'openid roles nickname name email profile read:profiles ' + $.qgcidm.config.level ;

            $.qgcidm._storage = new CrossStorageClient($.qgcidm.config.home + '/hub.html');

            var forgotPasswordLink = 'https://' + $.qgcidm.config.webtaskHome + '/ChangePassword/forgot?bk=' + window.location.href;

            $.qgcidm._lock = new Auth0Lock($.qgcidm.config.clientID, $.qgcidm.config.domain, {
                auth: {
                    redirectUrl: $.qgcidm.config.returnTo,
                    responseType: 'token',
                    params: { scope: $.qgcidm._scope }
                },
                webtaskHome: $.qgcidm.config.webtaskHome,
                widgetHome: $.qgcidm.config.home,
                codeTimeoutLimit: "30",
                socialButtonStyle: "big",
                forgotPasswordLink: forgotPasswordLink,
                languageDictionary: {
                    title: "",
                    loginLabel: "Sign in",
                    loginSubmitLabel: "Sign in",
                    signUpLabel: "Create",
                    signUpSubmitLabel: "Create",
                    passwordInputPlaceholder: "Password",
                    emailInputPlaceholder: "Email address",
                    signUpTerms: "By accessing this service you are agreeing to the <a href='https://account.qld.gov.au/help/terms.html' target='_new'>terms of use</a>.",
                    loginWithLabel: "",
                    signUpWithLabel: "",
                    error: {
                        login: {
                            "blocked_user": "The user is blocked.",
                            "invalid_user_password": "Wrong credentials.",
                            "lock.fallback": "We're sorry, something went wrong when attempting to log in.",
                            "lock.invalid_code": "Wrong code.",
                            "lock.invalid_email_password": "Wrong email or password.",
                            "lock.invalid_username_password": "Wrong username or password.",
                            "lock.network": "We could not reach the server. Please check your connection and try again.",
                            "lock.popup_closed": "Popup window closed. Try again.",
                            "lock.unauthorized": "Permissions were not granted. Try again.",
                            "lock.mfa_registration_required": "Multifactor authentication is required but your device is not enrolled. Please enroll it before moving on.",
                            "lock.mfa_invalid_code": "The code you entered is incorrect. Please try again.",
                            "password_change_required": "You need to update your password because this is the first time you are logging in, or because your password has expired.", // TODO: verify error code
                            "password_leaked": "This login has been blocked because your password has been leaked in another website. We’ve sent you an email with instructions on how to unblock it.",
                            "too_many_attempts": "Your account has been blocked after multiple consecutive login attempts.",
                            "session_missing": "Couldn't complete your authentication request. Please try again after closing all open dialogs"
                        },
                        signUp: {
                            "invalid_password": "Password is invalid.",
                            "lock.fallback": "We're sorry, something went wrong when attempting to sign up.",
                            "user_exists": "An account already exists for this email address.  Please use another email.",
                            "username_exists": "An account already exists for this email address.  Please use another email."
                        }
                    },
                    success: {
                        codeSent: "We've just emailed your verification code to you. Please enter the code below."
                    }
                },
                theme: {
                    logo: $.qgcidm.config.home + '/image/qld.png',
                    primaryColor: '#005375'
                },
                rememberLastLogin: false,
                allowForgotPassword: true,
                closable: true,
                mustAcceptTerms: true,
                additionalSignUpFields: [{
                    name: "phone",
                    placeholder: "Mobile number",
                    // The following properties are optional
                    icon: $.qgcidm.config.home + "/phone.png",
                    validator: function(phone) {
                        var pattern = new RegExp(/^04[0-9]{8}$/g);
                        var result = pattern.test(phone);
                        return {
                            valid: result,
                            hint: "Invalid mobile number. Please enter valid mobile number."
                        };
                    }
                },
                    {
                        name: "verifycode",
                        placeholder: "Enter code",
                        // The following properties are optional
                        icon: $.qgcidm.config.home + "/qrcode.png",
                        validator: function(phone) {
                            var pattern = new RegExp(/^[0-9]{6}$/g);
                            var result = pattern.test(phone);
                            return {
                                valid: result,
                                hint: "Please enter the six digit code."
                            };
                        }
                    }]

            });
        },

        updateProfile: function(callback) {

            $.qgcidm.getToken(function(id_token) {

                if (id_token != null && $.qgcidm._lock != null) {
                    $.qgcidm._lock.getProfile(id_token, function(error, profile) {
                        if (error) {
                            console.log('error',error);
                            if (error.error == 'Unauthorized') {
                                alert('Your server session has expired, please click ok to continue');
                            }
                            $.qgcidm.delToken(function(){
                                window.location.reload();
                            });
                        }

                        $.qgcidm.profile = profile;

                        $('#qg-login-container').removeClass('logged-out').addClass('logged-in');

                        var pic = $.qgcidm.profile.picture;
                        var username = $.qgcidm.profile.nickname || $.qgcidm.profile.name || $.qgcidm.profile.email;
                        $('#qg-gravatar').attr('src', pic).attr('alt', username);
                        $('#qg-username').text(username);

                        if (callback) {
                            callback();
                        }
                    });
                }
            });
        },

        activity: function() {
            //console.log('activity noticed, resetting activity timer');
            clearTimeout($.qgcidm._timer);
            $.qgcidm._timer = setTimeout($.qgcidm.timeout, $.qgcidm._timeout);
        },

        timeout: function() {
            console.log('inactivity timer expired, clearing the token, and reloading the page');
            $.qgcidm.delToken(function() {
                alert('Your client session has expired, please click ok to continue');
                window.location.reload();
            });
        },

        listen: function() {
            console.log('enabling timer for ' + $.qgcidm._timeout);
            $.qgcidm._timer = setTimeout($.qgcidm.timeout, $.qgcidm._timeout);
            $(document).bind('mousemove', $.qgcidm.activity);
            $(document).bind('keydown', $.qgcidm.activity);
        },

        quiet: function() {
            clearTimeout($.qgcidm.timeout);
            $(document).unbind('mousemove', $.qgcidm.activity);
            $(document).unbind('keydown', $.qgcidm.activity);
        },

        getLoginURL: function(e) {
            return 'https://' + $.qgcidm.config.domain + '/authorize?'
                + 'client_id=' + $.qgcidm.config.clientID + '&'
                + 'response_type=token&'
                + 'scope=' + $.qgcidm._scope.replace(/\s/g,'%20') + '&'
                + 'connection=' + $.qgcidm.levels[$.qgcidm.config.level] + '&'
                + 'redirect_uri=' + $.qgcidm.config.returnTo
                ;
        },

        getLogoutURL: function(e) {
            return 'https://' + $.qgcidm.config.domain + '/v2/logout?'
                + 'federated&'
                + 'client_id=' + $.qgcidm.config.clientID + '&'
                + 'returnTo=' + $.qgcidm.config.returnTo
                ;
        },

        toggleLoginMenu: function(options) {
            options = options || {forceHide: false};

            var $loginMenu = $('#qg-login-menu');
            var $loginTrigger = $('#qg-login-trigger');

            if ($('#qg-login-menu:visible').length > 0 || options.forceHide) {
                $loginMenu.hide();
                $loginTrigger.removeClass('expanded');
                $loginMenu.trigger('hidden.qgcidm.loginMenu');
            } else {
                $loginMenu.show();
                $loginTrigger.addClass('expanded');
                $loginMenu.trigger('shown.qgcidm.loginMenu');
            }
        },

        enable: function(e) {

            $.qgcidm.getToken(function(id_token) {

                //____________________________________________________________________________________________________
                // set a timeout and clear the token if inactive for 20 minutes = 1200 seconds

                if (id_token != null) {
                    $.qgcidm.listen();
                }
                else {
                    $.qgcidm.quiet();
                }

                //____________________________________________________________________________________________________

                $.each($.qgcidm._avatar, function(key, avatar) {
                    // clean old avatar
                    $(avatar).find('*').remove();
                    $(avatar).load('/cidm-login-widget/qg-login-container.html', function() {
                        $('#qg-btn-login').login();
                        $('#qg-btn-logout').logout();
                        $('#qg-myaccount-link').attr('href', $.qgcidm.config.myAccountURL);

                        $('#qg-login-trigger').find('button').click(function() {
                            $.qgcidm.toggleLoginMenu();
                        });

                        $('#qg-login-container').removeClass('logged-in').addClass('logged-out');

                        $('.avatar', document).trigger("loggedIn", [id_token]);
                    });
                });
            });

            $.qgcidm._lock.on("authenticated", function(authResult) {
                console.log('authResult=',authResult);
                $.qgcidm.setToken(authResult.idToken, function() {
                    $.qgcidm.listen();
                    $.qgcidm.updateProfile(function() {
                        $.qgcidm._onLogin.fire();
                        $(".avatar". document).trigger("loggedIn", [authResult.idToken]);
                    });
                });
            });

            $.qgcidm._lock.on("authorization_error", function(error) {
                if ($.qgcidm.config.wrapped) {
                    alert($.qgcidm.changeErrorMessage(error.error_description));
                }
                else {
                    $.qgcidm._lock.show({
                        flashMessage:{
                            type: 'error',
                            text: $.qgcidm.changeErrorMessage(error.error_description)
                        }
                    });
                }
            });

            $.qgcidm.updateProfile(function() {
                $.qgcidm._onLogin.fire();
            });

        },

        changeErrorMessage: function(errMsg) {
            var msg = "";
            switch(errMsg)
            {
                case "user is blocked":
                {
                    msg = "Your account has been locked or is inactive. If your account has been locked you will need to wait 20 minutes before trying again. If you have closed your account you will need to create another account.";
                    break;
                }

                case "Please verify your email before logging in.":
                {
                    msg = "Please verify your email before logging in.";
                    break;
                }

                default:
                {
                    msg = errMsg;
                }
            }
            return msg;
        }

    };

    // jquery element decorators for QGCIDM NEO
    $.fn.extend({
        login: function() {
            return $(this).each(function() {
                $(this).click(function(e) {
                    e.preventDefault();
                    if ($.qgcidm.config.wrapped) {
                        window.location.href = $.qgcidm.getLoginURL();
                    }
                    else {
                        $.qgcidm._lock.show();
                    }
                });
            });
        },
        logout: function() {
            return $(this).each(function() {
                $(this).click(function(e) {
                    e.preventDefault(e);
                    $.qgcidm.quiet();
                    $.qgcidm.delToken(function(){
                        $.qgcidm.profile = null;

                        $('#qg-login-container').removeClass('logged-in').addClass('logged-out');

                        $.qgcidm.profile = null;
                        $.qgcidm._onLogout.fire();
                        if ($.qgcidm.config.wrapped) {
                            window.location.href = $.qgcidm.getLogoutURL();
                        }
                        else {
                            var url = $.qgcidm.config.returnTo;
                            window.location.href = url.substr(0,url.indexOf('#'));
                        }
                    });
                });
            });
        },
        avatar: function() {
            return $(this).each(function() {
                $.qgcidm._avatar.push($(this));
            });
        },
        onLogin: function(callback) {
            return $(this).each(function() {
                var me = this;
                $.qgcidm._onLogin.add(function() {
                    callback(me);
                });
            });
        },
        onLogout: function(callback) {
            return $(this).each(function() {
                var me = this;
                $.qgcidm._onLogout.add(function() {
                    callback(me);
                });
            });
        }
    });

    window.$ = $;
    return $;

});