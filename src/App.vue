<template>
    <div id="app">
        <v-app id="inspire">
            <v-navigation-drawer
                v-model="drawer"
                app
            >
                <v-list dense>
                    <v-list-item link v-for="(item, key) in menu" :key="key" @click="screen = item.id; drawer = !drawer;">
                        <v-list-item-action>
                            <v-icon>{{item.icon}}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>{{item.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-app-bar
                    app
                    color="indigo"
                    dark
            >
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
                <v-toolbar-title>WS Tester</v-toolbar-title>
            </v-app-bar>

            <v-content v-if="screen == 'home'">
                <v-container
                        class="fill-height"
                        fluid
                >
                    <v-row
                        align="center"
                        justify="center"
                        style="flex-direction: column;"
                    >

                        <div v-if="!connected">
                            <h1>Connect to Websocket</h1>

                            <v-text-field
                                :disabled="isConnectingToHost"
                                v-model="host"
                                label="Host"
                                clearable
                            ></v-text-field>

                            <v-text-field
                                :disabled="isConnectingToHost"
                                v-model="protocols"
                                label="Subprotocols (optional, divided by comma)"
                                clearable
                            ></v-text-field>

                            <v-btn
                                :disabled="isConnectingToHost"
                                :loading="isConnectingToHost"
                                class="ma-2"
                                outlined
                                color="primary"
                                right
                                style="float: right; margin-right: 0 !important;"
                                @click="connect()"
                            >
                                Connect
                            </v-btn>

                        </div>

                        <div v-if="connected">
                            <h1>Connected to {{host}}</h1>

                            <p>Ready to rock! Send a message to the host:</p>

                            <v-select
                                v-model="selected_message_type"
                                :items="message_types"
                                label="Message type"
                                item-text="name"
                                item-value="id"
                                return-object
                                @change="selectMode"
                            ></v-select>

                            <v-alert
                                type="info"
                                outlined
                                icon="mdi-arrow-right-bold"
                            >
                                <codemirror
                                    id="input"
                                    ref="input"
                                    :value="code"
                                    :options="cmOptions"
                                    @ready="onCmReady"
                                    @focus="onCmFocus"
                                    @input="onCmChange"
                                >
                                </codemirror>
                            </v-alert>

                            <div class="d-flex flex-row mb-6 flex-row-reverse">
                                <v-btn
                                    class="ma-2"
                                    outlined
                                    color="success"
                                    @click="send(code)"

                                    style="margin-right: 0 !important;"
                                >
                                    Send
                                </v-btn>

                                <v-btn
                                    class="ma-2"
                                    outlined
                                    color="error"
                                    @click="closeConnectionDialog = true"
                                >
                                    Close connection
                                </v-btn>
                            </div>



                            <v-dialog v-model="closeConnectionDialog" persistent min-width="280px" max-width="500px">
                                <v-card>
                                    <v-card-title class="headline">Closing connection</v-card-title>
                                    <v-card-text>

                                        <v-text-field
                                            v-model="disconnectCode"
                                            label="Code"
                                            type="number"
                                        ></v-text-field>

                                        <v-textarea
                                            v-model="disconnectReason"
                                            label="Reason"
                                        ></v-textarea>

                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="closeConnectionDialog = !closeConnectionDialog">Cancel</v-btn>
                                        <v-btn color="error" text @click="closeConnection(disconnectCode, disconnectReason); closeConnectionDialog = !closeConnectionDialog;">Disconnect</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>



                            <div v-if="history.length > 0">
                                <h1>Last response:</h1>

                                <v-alert
                                    type="success"
                                    outlined
                                    icon="mdi-arrow-left-bold"
                                >
                                    <codemirror
                                        id="lastOutput"
                                        ref="lastOutput"
                                        :value="history[history.length - 1].data"
                                        :options="cmReadOnlyOptions"
                                    >
                                    </codemirror>
                                </v-alert>
                            </div>



                        </div>


                    </v-row>
                </v-container>
            </v-content>

            <v-content v-if="screen == 'settings'">
                Under construction
            </v-content>

            <v-content v-if="screen == 'history'">
                Under construction
            </v-content>

            <!--
            <v-footer
                    color="indigo"
                    app
            >
                <span class="white--text">&copy; 2019</span>
            </v-footer>
            -->
        </v-app>

    </div>
</template>

<script>
    import { codemirror } from 'vue-codemirror'
    import 'codemirror/theme/3024-night.css'
    import 'codemirror/theme/3024-night.css'
    import 'codemirror/mode/javascript/javascript.js'
    import 'codemirror/mode/xml/xml.js'


    //Code folding
    import 'codemirror/addon/fold/foldgutter.css'
    import 'codemirror/addon/fold/foldcode.js'
    import 'codemirror/addon/fold/foldgutter.js'
    import 'codemirror/addon/fold/brace-fold.js'
    import 'codemirror/addon/fold/xml-fold.js'
    import 'codemirror/addon/fold/indent-fold.js'
    import 'codemirror/addon/fold/comment-fold.js'

    //Search
    import 'codemirror/addon/dialog/dialog.css'
    import 'codemirror/addon/search/matchesonscrollbar.css'
    import 'codemirror/addon/dialog/dialog.js'
    import 'codemirror/addon/search/searchcursor.js'
    import 'codemirror/addon/search/search.js'
    import 'codemirror/addon/scroll/annotatescrollbar.js'
    import 'codemirror/addon/search/matchesonscrollbar.js'
    import 'codemirror/addon/search/jump-to-line.js'

    export default {
        name: 'App',

        props: {
            source: String,
        },

        components: {
            codemirror
        },

        data: function(){

            const messageTypes = [
                {name: "Plain Text", id: "text/plain"},
                {name: "JSON", id: "application/json"},
                {name: "XML", id: "application/xml"}
            ];

            const defaultMode = messageTypes[0];
            const defaultTheme = "3024-night";
            const defaultScreen = "home";

            const cmOptions = {
                tabSize: 2,
                mode: defaultMode.id,
                theme: defaultTheme,
                lineNumbers: true,
                // line: true,
                lineWrapping: true,
                extraKeys: {
                    "Ctrl-Q": function(cm){
                        cm.foldCode(cm.getCursor());
                    },
                    "Alt-F": "findPersistent",
                    "F11": function(cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function(cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    }
                },
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            };



            return {
                host: "wss://echo.websocket.org/",
                websocket: null,
                history: [],
                cmOptions: cmOptions,

                cmReadOnlyOptions: {
                    ...cmOptions,
                    readOnly: true
                },

                selected_message_type: defaultMode,
                message_types: messageTypes,
                screen: defaultScreen,
                drawer: false,
                menu: [
                    {
                        name: "Home",
                        id: 'home',
                        icon: "mdi-home"
                    },
                    {
                        name: "History",
                        id: 'history',
                        icon: "mdi-history"
                    },
                    {
                        name: "Settings",
                        id: 'settings',
                        icon: "mdi-cogs"
                    },
                ],
                themes: [
                    "default",
                    "3024-day",
                    "3024-night",
                    "abcdef",
                    "ambiance",
                    "ayu-dark",
                    "ayu-mirage",
                    "base16-dark",
                    "base16-light",
                    "bespin",
                    "blackboard",
                    "cobalt",
                    "colorforth",
                    "darcula",
                    "dracula",
                    "duotone-dark",
                    "duotone-light",
                    "eclipse",
                    "elegant",
                    "erlang-dark",
                    "gruvbox-dark",
                    "hopscotch",
                    "icecoder",
                    "idea",
                    "isotope",
                    "lesser-dark",
                    "liquibyte",
                    "lucario",
                    "material",
                    "material-darker",
                    "material-palenight",
                    "material-ocean",
                    "mbo",
                    "mdn-like",
                    "midnight",
                    "monokai",
                    "moxer",
                    "neat",
                    "neo",
                    "night",
                    "nord",
                    "oceanic-next",
                    "panda-syntax",
                    "paraiso-dark",
                    "paraiso-light",
                    "pastel-on-dark",
                    "railscasts",
                    "rubyblue",
                    "seti",
                    "shadowfox",
                    "solarized dark",
                    "solarized light",
                    "the-matrix",
                    "tomorrow-night-bright",
                    "tomorrow-night-eighties",
                    "ttcn",
                    "twilight",
                    "vibrant-ink",
                    "xq-dark",
                    "xq-light",
                    "yeti",
                    "yonce",
                    "zenburn",
                ],
                code: "",

                connected: false,
                isConnectingToHost: false,
                closeConnectionDialog: false,
                protocols: "soap,wamp",

                disconnectReason: "Goodbye!",
                disconnectCode: 1000,
            };
        },

        methods: {
            onCmReady(){
                // console.log(e);
            },
            onCmFocus(){
                // console.log(e);
            },
            onCmChange(text){
                this.code = text;
            },



            /* WebSocket */

            onOpen(e){
                console.info("Connection opened: ", e);
                this.connected = true;
                this.isConnectingToHost = false;
                this.code = "";
            },
            onMessage(e){
                console.log("Got message: ", e);
                this.isConnectingToHost = false;

                this.history.push({
                    data: e.data
                });

            },
            onClose(e){
                console.info("Connection closed: ", e);
                this.connected = false;
                this.isConnectingToHost = false;
            },
            onError(e){
                console.error("Websocket error: ", e);
                this.connected = false;
                this.isConnectingToHost = false;
            },

            selectMode(){
                this.$refs.input.codemirror.setOption('mode', this.selected_message_type.id);
            },

            connect(){
                this.isConnectingToHost = true;


                const __parent = this;

                let subprotocols = [];
                if(this.protocols != null && this.protocols.trim().length > 0){
                    subprotocols = this.protocols.split(",");
                }

                try {
                    this.websocket = new WebSocket(this.host, subprotocols);
                    this.websocket.onopen = function(e){ __parent.onOpen(e) };
                    this.websocket.onmessage = function(e){ __parent.onMessage(e) };
                    this.websocket.onclose = function(e){ __parent.onClose(e) };
                    this.websocket.onerror = function(e){ __parent.onError(e) };
                } catch(e) {
                    console.error("Preparing connection error: ", e);
                }


            },

            send(message){
                if(this.websocket == null || !this.connected) return;
                this.websocket.send(message);
            },

            closeConnection(code, reason){
                try{
                    if(this.websocket == null || !this.connected) return;
                    this.websocket.close(code, reason);
                } catch(e){
                    console.error("Closing connection error: ", e);
                }

            }

        }
    };
</script>

<style>
    #input{
        /*min-width: 60vw;*/
        /*max-width: 90vw;*/
        width: 60vw;
    }
</style>