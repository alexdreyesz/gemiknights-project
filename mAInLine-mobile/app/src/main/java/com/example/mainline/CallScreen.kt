package com.example.mainline

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class CallScreen : AppCompatActivity() {

    private lateinit var txtEmergencySummary: TextView

    // Variable to store the full emergency message
    private lateinit var emergencyMessage: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_call_screen)

        txtEmergencySummary = findViewById(R.id.txtEmergencySummary)

        val btnMedicalEmergency = findViewById<Button>(R.id.btnMedicalEmergency)
        val btnPhysicalEmergency = findViewById<Button>(R.id.btnPhysicalEmergency)
        val btnHome = findViewById<Button>(R.id.btnHome)

        btnMedicalEmergency.setOnClickListener {
            generateEmergencyMessage()
        }

        btnPhysicalEmergency.setOnClickListener {
            generateEmergencyMessage()
        }

        btnHome.setOnClickListener {
            finish()
        }
    }

    private fun generateEmergencyMessage() {
        val prefs = getSharedPreferences("MainlinePrefs", MODE_PRIVATE)
        val medical = prefs.getString("medical_history", "") ?: ""
        val allergies = prefs.getString("allergies", "") ?: ""

        val fullInfo = "Medical History: $medical\nAllergies: $allergies"

        val location = "UCF Business Administration, I-12494 University Blvd, Orlando, FL 32816"

        val url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAV-yU7_B4uobNCSYFN8CarikpKyuxKrik"

        val client = okhttp3.OkHttpClient()

        val promptText = """
            please create a clear, concise, and professional emergency message for responders based on the following medical information and location.
            the message should be simple and plain text (no markdown, no asterisks, no all caps), about 3-4 sentences.
            it should summarize key medical conditions and allergies without repeating the input verbatim.
            please also include the location information clearly.

            medical information:
            $fullInfo

            location:
            $location
        """.trimIndent()

        val parts = JSONObject().apply {
            put("text", promptText)
        }

        val userMessage = JSONObject().apply {
            put("role", "user")
            put("parts", org.json.JSONArray().put(parts))
        }

        val json = JSONObject().apply {
            put("contents", org.json.JSONArray().put(userMessage))
        }

        val body = json.toString().toRequestBody("application/json".toMediaType())

        val request = okhttp3.Request.Builder()
            .url(url)
            .post(body)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                runOnUiThread {
                    txtEmergencySummary.text = "Error generating message: ${e.message}"
                }
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                val responseText = response.body?.string()
                if (responseText.isNullOrEmpty()) {
                    runOnUiThread {
                        txtEmergencySummary.text = "Empty response from server"
                    }
                    return
                }

                val summary = try {
                    val jsonResponse = JSONObject(responseText)
                    jsonResponse.getJSONArray("candidates")
                        .getJSONObject(0)
                        .getJSONObject("content")
                        .getJSONArray("parts")
                        .getJSONObject(0)
                        .getString("text")
                        .trim()
                } catch (e: Exception) {
                    runOnUiThread {
                        txtEmergencySummary.text = "Failed to parse: ${e.message}\n$responseText"
                    }
                    return
                }

                // Save the entire message to the property
                emergencyMessage = "Hello, I am main line A I, I am calling on behalf of my user as they are experiencing a medical emergency and are unable to speak.\n\nEmergency summary: $summary"

                runOnUiThread {
                    txtEmergencySummary.text = emergencyMessage
                }

                callEmergencyNumber(emergencyMessage)
            }
        })
    }

    private fun callEmergencyNumber(message: String) {
        val url = "http://10.0.2.2:3000/call-emergency"

        val json = JSONObject()
        json.put("phoneNumber", "+18135100496")  // Emergency contact number
        json.put("message", message)

        val body = json.toString().toRequestBody("application/json".toMediaType())

        val request = okhttp3.Request.Builder()
            .url(url)
            .addHeader("Content-Type", "application/json")
            .addHeader("X-Requested-With", "XMLHttpRequest")  // ✅ Required by Replit
            .post(body)
            .build()

        val client = okhttp3.OkHttpClient()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                runOnUiThread {
                    txtEmergencySummary.text = "Failed to initiate call: ${e.message}"
                }
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                val responseText = response.body?.string()
                runOnUiThread {
                    if (response.isSuccessful) {
                        txtEmergencySummary.text = "Call initiated successfully."
                    } else {
                        txtEmergencySummary.text = "Call failed: $responseText"
                    }
                }
            }
        })
    }
}
