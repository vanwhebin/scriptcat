// splitChunks对injected可能会有问题

import { FrontendGrant, ScriptContext } from "./apps/grant/frontend";
import { BrowserMsg } from "./apps/msg-center/browser";
import { ScriptValueChange } from "./apps/msg-center/event";
import { ScriptCache } from "./model/do/script";
import { Value } from "./model/do/value";
import { addStyle } from "./pkg/frontend";
import { buildThis, createContext } from "./pkg/sandbox";

let browserMsg = new BrowserMsg(ScriptFlag);
browserMsg.listen("scripts", (msg) => {
    let scripts: ScriptCache[] = msg;
    browserMsg.listen(ScriptValueChange, (msg: Value) => {
        scripts.forEach(val => {
            if (!val.value) {
                val.value = {};
            }
            if ((val.namespace && val.namespace == msg.namespace) || val.id == msg.id) {
                val.context?.ValueChange(msg.key, msg);
            }
        })
    });
    scripts.forEach(script => {
        // 构建沙盒
        let context: ScriptContext;
        if (script.grantMap!['none']) {
            context = <any>window;
        } else {
            context = new FrontendGrant(script, browserMsg);
            context = createContext(context, script);
            if (script.grantMap!['unsafeWindow']) {
                context['unsafeWindow'] = window;
            }
            context = buildThis(window, context);
            script.context = context;
        }
        if ((<any>window)[script.flag!]) {
            (<any>window)[script.flag!].apply(context, [context]);
        }
        Object.defineProperty(window, script.flag!, {
            get: () => { return undefined; },
            set: (val) => {
                val.apply(context, [context]);
            }
        });
        // 注入css
        script.metadata['require-css']?.forEach(val => {
            let res = script.resource![val];
            if (res) {
                addStyle(res.content);
            }
        });
    });

});