package com.example.mainline

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {

    private lateinit var medicalHistoryInput: EditText
    private lateinit var allergiesInput: EditText
    private lateinit var nextButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        medicalHistoryInput = findViewById(R.id.inputMedicalHistory)
        allergiesInput = findViewById(R.id.inputAllergies)
        nextButton = findViewById(R.id.btnRequestLocation) // Reuse the same button ID

        loadSavedData()

        nextButton.setOnClickListener {
            saveMedicalData()
            navigateToCallScreen()
        }
    }

    private fun saveMedicalData() {
        val medicalHistory = medicalHistoryInput.text.toString().trim()
        val allergies = allergiesInput.text.toString().trim()

        if (medicalHistory.isEmpty() && allergies.isEmpty()) {
            Toast.makeText(this, "Please enter some medical info", Toast.LENGTH_SHORT).show()
            return
        }

        val prefs = getSharedPreferences("MainlinePrefs", Context.MODE_PRIVATE)
        with(prefs.edit()) {
            putString("medical_history", medicalHistory)
            putString("allergies", allergies)
            apply()
        }


    }

    private fun loadSavedData() {
        val prefs = getSharedPreferences("MainlinePrefs", Context.MODE_PRIVATE)
        medicalHistoryInput.setText(prefs.getString("medical_history", ""))
        allergiesInput.setText(prefs.getString("allergies", ""))
    }

    private fun navigateToCallScreen() {
        val intent = Intent(this, CallScreen::class.java)
        startActivity(intent)
        finish()
    }
}
