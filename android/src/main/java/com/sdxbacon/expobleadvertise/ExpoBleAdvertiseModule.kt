package com.sdxbacon.expobleadvertise

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import java.net.URL

class BroadcastOptions : Record {
    @Field
    val serviceUUIDs: Array<String> = arrayOf()
}

class ExpoBleAdvertiseModule : Module() {
    private val bleAdvertiser by lazy {
        ExpoBleAdvertiser(appContext)
    }

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoBleAdvertise')` in JavaScript.
        Name("ExpoBleAdvertise")

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("setValueAsync") { value: String ->
            // Send an event to JavaScript.
            sendEvent(
                "onChange", mapOf(
                    "value" to value
                )
            )
        }

        AsyncFunction("startBroadcast") { options: BroadcastOptions ->
            // Start broadcasting
            // ...
            var onFinished = { result: String ->
                sendEvent(
                    "onChange", mapOf(
                        "value" to result
                    )
                )
            }

            bleAdvertiser.startAdvertising(options.serviceUUIDs[0], onFinished)
        }
    }
}
