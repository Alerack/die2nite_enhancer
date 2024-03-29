Module.register(function() {

    var MODULE_NAME = 'shortcuts';

    /******************
     * Module context *
     ******************/

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable shortcuts';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Let you use keyboard shortcuts in town to quickly access important places (e.g.: banks, gates).';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer les raccourcis clavier';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Active des raccourcis claviers pour accéder rapidement aux places importantes en ville (e.g.: la banque, les portes).';

        I18N.set(i18n);
    }

    /**
     * Handle the keydown event.
     * @param integer keycode The last keycode
     * @param integer previous_keycode The last-but-one keycode
     */
    function on_keydown_event(keycode, previous_keycode) {
        if (previous_keycode !== this.properties.binds.main) {
            return;
        }

        for (var bind in this.properties.binds) {
            if (this.properties.binds[bind] === keycode) {
                return D2N.go_to_city_page(bind);
            }
        }
    }

    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false,
            binds: {
                // This bind has to be pressed first
                main: 71, // 'G'
                // Page specific bind (have to be preceded by a 'main' bind stoke)
                overview: 79, // 'O'
                home: 72, // 'H'
                well: 87, // 'W'
                bank: 66, // 'B'
                citizens: 67, // 'C'
                buildings: 68, // 'D'
                doors: 71, // 'G'
                upgrades: 80, // 'P'
                tower: 84, // 'T'
                refine: 77, // 'M'
                guard: 76 // 'L'
            }
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.GENERAL,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                var f = on_keydown_event.bind(this);

                JS.keydown_event(function(keycode, previous_keycode) {
                    f(keycode, previous_keycode);
                });
            }
        }

    };
});
