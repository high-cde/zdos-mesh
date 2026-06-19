plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    namespace = "systems.zdos.terminal"
    compileSdk = 34

    defaultConfig {
        applicationId = "systems.zdos.terminal"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.compose.material3:material3:1.2.1")
}

android {
    applicationVariants.all {
        outputs.all {
            outputFileName = "Termux.apk"
        }
    }
}

android {
    applicationVariants.all {
        outputs.all {
            outputFileName = "Termux.apk"
        }
    }
}

android {
    applicationVariants.all {
        outputs.all {
            outputFileName = "Termux.apk"
        }
    }
}
