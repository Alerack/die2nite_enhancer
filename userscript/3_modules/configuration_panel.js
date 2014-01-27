Module.register(function() {

    var MODULE_NAME = 'configuration_panel';

    /******************
     * Module context *
     ******************/

    /**
     * Inject in the input field to store the corresponding module name.
     */
    var INPUT_DATA_MODULE_KEY = 'data-module';

    /**
     * Inject in the input field to store the corresponding module name.
     */
    var INPUT_DATA_MODULE_PROPERTY_KEY = 'data-module-property';

    /**
     * The node where the module configuration div have to be inserted. This
     * variable is filled during the loading.
     */
    var configuration_panel_extensible_zone_node_ = null;

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Settings';
        i18n[I18N.LANG.EN][MODULE_NAME + '_description'] = 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_help_image_url'] = '/gfx/loc/en/helpLink.gif';
        i18n[I18N.LANG.EN][MODULE_NAME + '_save_button'] = 'Save';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Paramètres';
        i18n[I18N.LANG.FR][MODULE_NAME + '_description'] = 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu, toutes les fonctionnalités peuvent être controlées depuis ce panneau de configuration.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_help_image_url'] = '/gfx/loc/fr/helpLink.gif';
        i18n[I18N.LANG.FR][MODULE_NAME + '_save_button'] = 'Sauvegarder';

        i18n[I18N.LANG.ES] = {};
        i18n[I18N.LANG.ES][MODULE_NAME + '_help_image_url'] = '/gfx/loc/es/helpLink.gif';

        i18n[I18N.LANG.DE] = {};
        i18n[I18N.LANG.DE][MODULE_NAME + '_help_image_url'] = '/gfx/loc/de/helpLink.gif';

        I18N.set(i18n);
    }

    /**
     * Load the modules in the configuration panel.
     */
    function load_modules_in_configuration_panel()
    {
        Module.iterate(function(module) {

            // if configurable object does not exist, skip it
            if (typeof module.configurable === 'undefined') {
                return;
            }

            JS.each(module.configurable, function(key, value) {
                var input_id = 'd2ne_module_' + module.name + '_' + key;
                var input_value = module.properties[key];

                var json_node =
                    ["div", {},
                        null,
                        ["label", { "for": input_id }, I18N.get(value.short_desc_I18N)],
                        ["a", { "class": "d2ne_tooltip", "href": "javascript:void(0)", "tooltip": I18N.get(value.full_desc_I18N)},
                            ["img", { "src": I18N.get(MODULE_NAME + '_help_image_url'), "alt": "" }],
                        ]
                    ];

                switch (value.type) {
                    case Module.PROPERTIES.BOOLEAN:
                        var node = ["input", { "id": input_id, "type": "checkbox" }];

                        node[1][INPUT_DATA_MODULE_KEY] = module.name;
                        node[1][INPUT_DATA_MODULE_PROPERTY_KEY] = key;

                        if (input_value === true) {
                            node[1].checked = ''; // declare a checked attribute
                        }
                        json_node[2] = node;
                        break;

                    default:
                        return;
                }

                configuration_panel_extensible_zone_node_.appendChild(JS.jsonToDOM(json_node, document));
            });
        });
    }

    /**
     * Listen for the event dispatched when all the modules are loaded.
     */
    function add_callback_when_all_modules_loaded()
    {
        // Set a callback when all the modules are loaded
        document.addEventListener('d2ne_all_modules_loaded', function() {
            load_modules_in_configuration_panel();
        });
    }

    /**
     * Fetch the configuration from the configuration panel and inject it in the
     * local storage.
     */
    function save_configuration()
    {
        var input_node = null;
        var module = null;
        var module_name = null;
        var property = null;
        var input_data = null;

        for (var i = 0, max = configuration_panel_extensible_zone_node_.childElementCount; i < max; ++i) {
            input_node = configuration_panel_extensible_zone_node_.childNodes[i].firstChild;
            module_name = input_node.getAttribute(INPUT_DATA_MODULE_KEY);
            module = Module.get(module_name);
            property = input_node.getAttribute(INPUT_DATA_MODULE_PROPERTY_KEY);

            // Get the value
            switch (module.configurable[property].type) {
                case Module.PROPERTIES.BOOLEAN:
                    input_data = input_node.checked;
                    break;

                default:
                    input_data = null;
                    break;
            }

            // Inject it into the object and save
            module.properties[property] = input_data;
            module.save_properties();

            console.log('----------');
            console.log(module);
            console.log(input_data);
        }
    }

    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.CONTAINER,

        properties: {
            enabled: true
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                add_callback_when_all_modules_loaded();
                add_i18n();
            },

            load: function() {
                JS.wait_for_id('main', function(node) {
                    // Create and inject panel style
                    JS.injectCSS(

                        '#d2ne_configuration_panel {' +
                            'z-index: 9;' +
                            'position: absolute;' +
                            'margin-top: 5px;' +
                            'margin-left: 44px;' +
                            'background-color: #5c2b20;' +
                            'border: 1px solid #000000;' +
                            'max-width: 430px;' +
                        '}' +

                        '#d2ne_configuration_panel h1 {' +
                            'height: auto;' +
                            'font-size: 8pt;' +
                            'text-transform: none;' +
                            'font-variant: small-caps;' +
                            'background: none;' +
                            'cursor: help;' +
                            'margin: 0;' +
                            'padding: 0;' +
                        '}' +
                        '#d2ne_configuration_panel:hover h1 {' +
                            'border-bottom: 1px solid #b37c4a;' +
                            'margin-bottom: 5px;' +
                        '}' +

                        '#d2ne_configuration_panel > div {' +
                            'line-height: 23px;' +
                            'border: 1px solid #f0d79e;' +
                            'padding-left: 5px;' +
                            'padding-right: 5px;' +
                        '}' +

                        '#d2ne_configuration_panel p {' +
                            'padding-bottom: 7px;' +
                            'margin-bottom: 3px;' +
                            'font-size: 9pt;' +
                            'line-height: 11pt;' +
                            'text-align: justify;' +
                            'border-bottom: 1px dashed #ddab76;' +
                        '}' +

                        '#d2ne_configuration_panel div > div > div > h4 {' +
                            'text-align: left;' +
                            'border-bottom: 1px dotted rgba(221, 171, 118, 0.8);' +
                            'padding-bottom: 4px;' +
                            'margin-bottom: 5px;' +
                            'margin-top: 4px;' +
                        '}' +
                        '#d2ne_configuration_panel div > div > div > h4 > img {' +
                            'vertical-align: -11%;' +
                            'margin-right: 5px;' +
                        '}' +

                        '#d2ne_configuration_panel div > div {' +
                            'position: relative;' +
                        '}' +
                        '#d2ne_configuration_panel div > div > div img {' +
                            'position: absolute;' +
                            'top: 0;' +
                            'bottom: 0;' +
                            'right: 0;' +
                            'margin: auto;' +
                            'margin-right: 4px;' +
                        '}' +

                        'a.d2ne_tooltip {' +
                            'display: inline;' +
                            'cursor: help' +
                        '}' +
                        'a.d2ne_tooltip img {' +
                            'border: 1px solid #5c2b20;' +
                        '}' +
                        'a.d2ne_tooltip img:hover {' +
                            'border: 1px solid #ffffff;' +
                        '}' +
                        'a.d2ne_tooltip:hover:after {' +
                            'line-height: normal;' +
                            'z-index: 98;' +
                            'position: absolute;' +
                            'top: 3px;' +
                            'right: -305px;' +
                            'content: attr(tooltip);' +
                            'font-family: Verdana;' +
                            'font-size: 12px;' +
                            'color: #ffffff;' +
                            'border: 1px solid #ecb98a;' +
                            'background-color: #5c2b20;' +
                            'background-image: url("/gfx/design/iconHelp.gif");' +
                            'background-position: 5px 0px;' +
                            'background-repeat: no-repeat;' +
                            'width: 250px;' +
                            'padding: 5px 10px 9px 30px;' +
                        '}' +

                        '#d2ne_configuration_panel > div > div > div:last-child {' +
                            'text-align: right;' +
                        '}' +

                        '#d2ne_configuration_panel a.button {' +
                            'width: auto;' +
                            'text-align: center;' +
                            'padding: 0;' +
                            'padding-top: 2px;' +
                            'height: 19px;' +
                            'margin: 0;' +
                            'margin-top: 5px;' +
                        '}'
                    );

                    var config_panel_div = JS.jsonToDOM(
                        ["div", { "id": "d2ne_configuration_panel" },
                            ["div", {},
                                ["h1", {},
                                    ["img", { "src": "/gfx/forum/smiley/h_city_up.gif", "alt": "" }],
                                    ["span", { "style": "display: none;" }, ' ' + I18N.get(MODULE_NAME + '_title')]
                                ],

                                ["div", { "style": "display: none;" },
                                    ["p", {}, I18N.get(MODULE_NAME + '_description')],

                                    ["div", {}],

                                    ["p", {},
                                        ["a", { "href": "javascript:void(0)", "class": "button",
                                                "onclick": function() { save_configuration(); JS.reload(); } },
                                            I18N.get(MODULE_NAME + '_save_button')]
                                    ],

                                    ["div", {},
                                        ["a", { "href": "__PROJECT_WEBSITE__", "target": "_blank" }, "__NAME__ v__VERSION__"]
                                    ]
                                ]
                            ]
                        ]
                    , document);

                configuration_panel_extensible_zone_node_ = config_panel_div.childNodes[0].childNodes[1].childNodes[1];

                    // Insert panel
                    node.insertBefore(config_panel_div, node.firstChild);

                    // Show/Hide config panel cache
                    var config_panel_toggled_elements_cache = document.querySelectorAll('#d2ne_configuration_panel > div > h1 > span, #d2ne_configuration_panel > div > div');
                    var config_panel_toggled_elements_cache_length = config_panel_toggled_elements_cache.length;

                    // Show panel on hover
                    config_panel_div.addEventListener('mouseover', function() {
                        config_panel_div.style['z-index'] = '11'; // This fix is needed for the spanish version, as the hero adds has a z-index of 10
                        for (var i = 0; i < config_panel_toggled_elements_cache_length; ++i) {
                            config_panel_toggled_elements_cache[i].style.display = 'inline';
                        }
                    }, false);

                    // Hide panel on mouse out
                    config_panel_div.addEventListener('mouseout', function() {
                        for (var i = 0; i < config_panel_toggled_elements_cache_length; ++i) {
                            config_panel_toggled_elements_cache[i].style.display = 'none';
                        }
                        config_panel_div.style['z-index'] = '9'; // See previous function comment
                    }, false);
                });
            }
        }

    };
});
