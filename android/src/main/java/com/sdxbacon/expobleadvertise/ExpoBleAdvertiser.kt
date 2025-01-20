package com.sdxbacon.expobleadvertise

import expo.modules.kotlin.AppContext
import android.content.Context
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.os.ParcelUuid
import java.util.UUID

class ExpoBleAdvertiser(appContext: AppContext) {
    private val bluetoothManager =
        appContext.reactContext?.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    private val bluetoothAdapter: BluetoothAdapter = bluetoothManager.adapter
    private var bluetoothLeAdvertiser: BluetoothLeAdvertiser? = null

    // TODO:
    private fun AdvertiseData.Builder.addServiceName(name: String): AdvertiseData.Builder {
        return this.addServiceData(
            ParcelUuid(UUID.nameUUIDFromBytes(name.toByteArray())),
            name.toByteArray()
        )
    }

    // Callback for advertising status
    // TODO:
    private val advertiseCallback = object : AdvertiseCallback() {
        override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
            println("Advertising started successfully")
        }

        override fun onStartFailure(errorCode: Int) {
            val errorMessage = when (errorCode) {
                ADVERTISE_FAILED_ALREADY_STARTED -> "Failed to start advertising as it was already started"
                ADVERTISE_FAILED_DATA_TOO_LARGE -> "Failed to start advertising as the data size was too large"
                ADVERTISE_FAILED_FEATURE_UNSUPPORTED -> "Failed to start advertising as the feature is not supported"
                ADVERTISE_FAILED_INTERNAL_ERROR -> "Failed to start advertising due to internal error"
                ADVERTISE_FAILED_TOO_MANY_ADVERTISERS -> "Failed to start advertising as no advertising instance is available"
                else -> "Failed to start advertising with unknown error: $errorCode"
            }
            println(errorMessage)
        }
    }

    fun startAdvertising(serviceUuid: String, onFinished: (message: String) -> Unit): String {
        if (bluetoothAdapter == null) {
            return "Bluetooth is not supported on this device"
        } else if (!bluetoothAdapter.isEnabled) {
            return "Bluetooth is not enabled"
        }

        bluetoothLeAdvertiser = bluetoothAdapter.bluetoothLeAdvertiser
        if (bluetoothLeAdvertiser == null) {
            return "BLE advertising not supported on this device"
        }

        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setConnectable(true)
            .setTimeout(0)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
            .build()

        val advertiseData = AdvertiseData.Builder()
            .setIncludeDeviceName(false)
            .addServiceUuid(ParcelUuid.fromString(serviceUuid))
            .build()

        val scanResponseData = AdvertiseData.Builder()
            .addManufacturerData(0x5566, byteArrayOf(0x22.toByte(), 0x66.toByte()))
            .build()

        val callback = object : AdvertiseCallback() {
            override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
                onFinished("Advertising started, service UUID: $serviceUuid")
            }

            override fun onStartFailure(errorCode: Int) {
                val errorMessage = when (errorCode) {
                    ADVERTISE_FAILED_ALREADY_STARTED -> "Failed to start advertising as it was already started"
                    ADVERTISE_FAILED_DATA_TOO_LARGE -> "Failed to start advertising as the data size was too large"
                    ADVERTISE_FAILED_FEATURE_UNSUPPORTED -> "Failed to start advertising as the feature is not supported"
                    ADVERTISE_FAILED_INTERNAL_ERROR -> "Failed to start advertising due to internal error"
                    ADVERTISE_FAILED_TOO_MANY_ADVERTISERS -> "Failed to start advertising as no advertising instance is available"
                    else -> "Failed to start advertising with unknown error: $errorCode"
                }
                onFinished("Failed to start advertising: $errorMessage")
            }
        }

        try {
            bluetoothLeAdvertiser!!.startAdvertising(
                settings,
                advertiseData,
                scanResponseData,
                callback
            )
            return "Advertising started"
        } catch (e: Exception) {
            return "Failed to start advertising: ${e.message}"
        }
    }
}
