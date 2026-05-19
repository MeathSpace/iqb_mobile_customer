export default {
  index: {
    header: "Welcome to IQBook",
    subheader:
      "Instantly book, style your hair and mustache the way you want by the stylist of your choice.",
    registerButtonText: "Register",
    loginButtonText: "Log In",
  },

  auth: {
    signin: {
      email: {
        label: "Email",
        placeholder: "Enter your email",
      },
      password: {
        label: "Password",
        placeholder: "Enter your password",
      },
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password?",
      signIn: "Sign In",
      signInWithApple: "Sign in with Apple",
      signInWithGoogle: "Sign in with Google",
      dontHaveAccount: "Don't have an account ?",
      or: "or",
      signup: "Sign up",

      errorStatesAndApi: {
        emailRequired: "Email is required",
        invalidEmailFormat: "Invalid email format",
        passwordRequired: "Password is required",
        passwordLeastCharecter: "Password must be at least 8 characters",
        passwordMostCharecter: "Password must be at most 20 characters",
        appleSigninFailed: "Apple Signin failed, try again.",
      },
    },
    signup: {
      email: { label: "Email", placeholder: "Enter your email" },
      password: { label: "Password", placeholder: "Enter your password" },
      signUp: "Sign Up",
      signUpWithApple: "Sign up with Apple",
      signUpWithGoogle: "Sign up with Google",
      alreadyMember: "Already a member ?",
      or: "or",
      logIn: "Log In",

      errorStatesAndApi: {
        emailRequired: "Email is required",
        invalidEmailFormat: "Invalid email format",
        passwordRequired: "Password is required",
        passwordLeastCharecter: "Password must be at least 8 characters",
        passwordMostCharecter: "Password must be at most 20 characters",
        retreiveEmailError: "We couldn't retrieve your email from Apple",
      },
    },
    forgotPassword: {
      header: "What's your email ?",
      subHeader: "Enter your email address to reset your password.",
      email: { label: "Email", placeholder: "Enter your email" },
      continue: "Continue",

      errorStatesAndApi: {
        emailRequired: "Email is required",
        invalidEmailFormat: "Invalid email format",
        forgetPasswordError: "Error in forget password ",
      },
    },
    passwordVerification: {
      header: "You're all set!",
      subHeader: "Enter the 4 digit code sent to your mobile number and email",
      verificationCode: {
        label: "Verification Code",
        placeholder: "Enter your otp",
      },
      verifyAndContinue: "Verify & Continue",
      didntReceiveCode: "Didn't receive the code ?",
      resend: "Resend",
      waitMessage: "Wait {{time}}s",

      errorStatesAndApi: {
        waitRequestCode: "Please wait before requesting another code.",
        resendVerifyCode: "Resend verification Code ",
        verificationOtpError: "Verification Otp error ",
        verificationCodeRequired: "Verification code is required",
        verificationCodeNotMatched: "Verification code does not match",
      },
    },

    // I forget to do this page
    forgetPasswordConfirmation: {
      header: "You're all set!",
      subHeader: "Set your password for log in.",
      passwordInput: {
        label: "Password",
        placeholder: "Enter your password",
      },
      confirmPasswordInput: {
        label: "Confirm password",
        placeholder: "Enter your confirm password",
      },
      reset: "Reset",
      errorStatesAndApi: {
        passwordRequired: "Password is required",
        passwordLeastCharecter: "Password must be at least 8 characters",
        passwordMostCharecter: "Password must be at most 20 characters",
        confirmPasswordRequired: "Confirm password is required",
        passwordsNotMatch: "Passwords do not match",
      },
    },

    personalInfo: {
      header: "It's time to create a profile !",
      subHeader: "Tell us little more about yourself",
      fullname: {
        label: "Full Name",
        placeholder: "Enter your full name",
      },
      gender: {
        label: "Gender",
        male: "Male",
        female: "Female",
        other: "Other",
      },
      mobileNumber: {
        label: "Mobile Number",
      },
      dateOfBirth: {
        label: "Date of Birth (Optional)",
        placeholder: "DD/MM/YY",
      },
      modal: {
        closeText: "close",
        openText: "open",
      },
      saveAndNext: "Save & Next",

      errorStatesAndApi: {
        invalidPhoneNumber: "Invalid phone number",
        fullNameRequired: "Full name is required",
        fullNameLeastCharecter: "Full name must be at least 2 characters",
        fullNameMostCharecter: "Full name must be at most 20 characters",
        phoneNumberRequired: "Phone number is required",
      },

      alertBox: {
        alertOne: {
          header: "Confirm",
          subHeader:
            "If you go back now, your signup progress will be lost. Are you sure you want to exit ?",
          cancel: "Cancel",
          ok: "Ok",
        },
      },
    },
    verification: {
      header: "You're all set!",
      subHeader: "Enter the 4 digit code sent to your mobile number and email",
      verificationCode: {
        label: "Verification Code",
        placeholder: "Enter your otp",
      },
      verifyAndCreate: "Verify & Create Account",
      didntReceiveCode: "Didn't receive the code ?",
      resend: "Resend",
      waitMessage: "Wait {{time}}s",
      errorStatesAndApi: {
        verificationCodeRequired: "Verification code is required",
        verificationCodeNotMatch: "Verification code does not match",
        coolDownRequired: "Please wait before requesting another code.",
        resendVerificationCode: "Resend verification Code ",
        verificationOtpError: "Verification Otp error ",
      },
    },
  },

  protected: {
    tabs: {
      home: "Home",
      qlist: "Qlist",
      salon: "Salon",
      appointment: "Appointment",
      profile: "Profile",
    },
    searchHeader: {
      placeholder: "Search city or salon name",
    },
    map: {
      connect: "Connect",
      close: "Close",
      description: "Description",
      contactUs: "Contact Us",
      anyQuestion: "If you have any questions",
      location: "Location",
      followUs: "Follow us on",
      socialLinks: "Social links",
      exploreAll: "Explore all",
      NoTabAvailable: "No {{selectedTab}} available",
      details: "Details",
      services: "Services",
      barbers: "Barbers",
      stylists: "Stylists",
      permissionDeniedError: "Permission denied",

      alertBox: {
        alertOne: {
          header: "Permission Denied",
          subHeader: "Location access is required to show your position.",
        },
        alertTwo: {
          header: "Success",
          subHeader: "Successfully added to favourites",
          error: {
            header: "Error",
            subHeader: "Something went wrong",
          },
        },
      },
    },
    customTabView: {
      header: "Browse Salons",
      subHeader: "You're currently not connected to any salon",
      buttonText: "Connect Now",
    },
    profile: {
      heading: "Profile",
      options: {
        favorites: "Favorites",
        changeSalon: "Change Salon",
        helpAndSupport: "Help & Support",
        about: "About",
        deleteAccount: {
          header: "Delete Account",
          alert: {
            header: "Delete Account",
            subHeader:
              "Are you sure you want to permanently delete your account?",
            cancel: "Cancel",
            delete: "Delete",
          },
        },
        logout: "Log Out",
      },

      language: {
        header: "language",
        english: "English",
        german: "German",
        portugese: "Portuguese",
      }
    },
    editProfile: {
      header: "Manage Account",
      fullname: {
        label: "Full Name",
        placeholder: "Enter your full name",
      },
      gender: {
        label: "Gender",
        male: "Male",
        female: "Female",
        other: "Other",
      },
      mobileNumber: {
        label: "Mobile Number",
      },
      dateOfBirth: {
        label: "Date of Birth (Optional)",
        placeholder: "DD/MM/YY",
      },
      modal: {
        closeText: "close",
        openText: "open",
      },
      editAndSave: "Edit & Save",

      errorStatesAndApi: {
        invalidPhoneNumber: "Invalid phone number",
        fullNameRequired: "Full name is required",
        fullNameLeastCharecter: "Full name must be at least 2 characters",
        fullNameMostCharecter: "Full name must be at most 20 characters",
        phoneNumberRequired: "Phone number is required",
        dateOfBirthRequired: "Date of birth is required",
      },

      profileUpdateSuccess: "Profile updated successfully",
      pickImageAlertGranted:
        "Sorry, we need media library permissions to make this work!",
      mimeNotInclude:
        "Invalid File Type. Only Webp, JPEG, JPG, and PNG images are allowed",
      imageUploadSuccess: "Image uploaded successfully",
    },
    connectSalon: {
      header: "Are you sure you want to disconnect ?",
      changeSalon: "Change Salon",
      alertBox: {
        header: "Warning",
        ok: "OK",
      },
    },


    myFavourites: {
      header: "My Favorites",
      error: {
        header: "No Favourite",
        subHeader: "You don't have any favourite salon",
      },
      alertBox: {
        header: "Remove Favourite Salon",
        subHeader:
          "Are you sure you want to remove this salon from your favourites ?",
        cancel: "Cancel",
        remove: "Yes, Remove",
      },
      somethingWentWrong: "Something went wrong",
    },
    helpAndSupport: {
      header: "Help & Support",
      subHeader:
        "If you are experiencing any issues, please let us know. We will try to resolve them as soon as possible.",
      title: {
        placeholder: "Title",
      },
      body: {
        placeholder: "Explain the problem",
      },
      submit: "Submit",
      emailUs: "Email Us :",
      email: "support@iqbook.io",

      errorStatesAndApi: {
        subjectRequired: "Subject is required",
        bodyRequired: "Body is required",
      },

      alertBox: {
        header: "Success",
        subHeader: "Email has been sent successfully to admin.",
        ok: "Ok",
        error: {
          header: "Error",
          subHeader: "Something went wrong. Please try again later.",
        },
      },
    },
    about: {
      index: {
        header: "About",
        options: {
          iqbookWebsite: "iqBook Website",
          termsOfService: "Terms of Services",
          privacyPolicy: "Privacy Policy",
          licenses: "Licenses",
        },
        version: "Version",
      },
      termService: {
        header: "Terms of Services",

        content: {
          mainHeader: "Welcome to our salon app!",
          intro: "By using this app, you agree to the terms below.",

          sections: {
            usingApp: {
              title: "1. Using Our App",
              points: [
                "Book appointments in advance",
                "Join the walk-in queue (single or group)",
                "Track your booking or queue status in real time",
              ],
              footer: "Use the app responsibly and follow all salon rules.",
            },

            bookingsQueue: {
              title: "2. Bookings & Queue",
              points: [
                "Choose your service, date, and time to book",
                "Join the queue as a single customer or with a group",
                "Estimated wait times may change based on salon flow",
              ],
            },

            responsibility: {
              title: "3. Your Responsibility",
              points: [
                "Provide correct info while booking or joining the queue",
                "Show up on time for appointments or queue turn",
                "Repeated no-shows may lead to restrictions",
              ],
            },

            cancellations: {
              title: "4. Cancellations",
              points: [
                "You can cancel or reschedule before your time",
                "For groups, cancel if you're not coming to avoid delays",
              ],
            },

            privacy: {
              title: "5. Your Privacy",
              descriptionBefore:
                "We protect your personal data and never share it without consent. See our ",
              linkText: "Privacy Policy",
              descriptionAfter: " for more.",
            },

            updates: {
              title: "6. Updates",
              description:
                "Terms may change. Keep using the app only if you agree with the latest version.",
            },

            help: {
              title: "7. Need Help?",
              description:
                "Contact us anytime from the app or at info@iqbook.io",
            },
          },
        },
      },
      privacyPolicy: {
        header: "Privacy Policy",

        content: {
          intro1:
            "Thank you for choosing to be part of our community at Iqbook. We are committed to protecting your personal information and your right to privacy.",

          intro2_before:
            "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ",
          intro2_highlight: "salon mobile application",
          intro2_after:
            ", including features such as appointment booking, queue management (single or group), notifications, and user profile management.",

          intro3:
            "By using the app, you agree to the terms outlined in this policy.",

          sections: {
            infoCollection: {
              title: "1. Information We Collect",
              description:
                "We may collect the following information when you use our app:",

              personal: {
                title: "a) Personal Information",
                points: [
                  "Name",
                  "Phone number",
                  "Email address (optional)",
                  "Gender (optional for service personalization)",
                  "Profile photo (optional)",
                ],
              },

              booking: {
                title: "b) Booking and Queue Details",
                points: [
                  "Services selected",
                  "Appointment date and time",
                  "Queue type (Single or Group)",
                  "Number of people in a group",
                ],
              },

              device: {
                title: "c) Device & Usage Data",
                points: [
                  "Device type (Android/iOS)",
                  "IP address and general location",
                  "App usage statistics",
                  "Crash and error logs",
                ],
              },
            },

            usage: {
              title: "2. How We Use Your Information",
              points: [
                "Schedule and manage your appointments",
                "Let you join the live queue (single/group)",
                "Send real-time notifications and reminders",
                "Provide estimated wait times and queue position",
                "Improve app performance and user experience",
                "Respond to support requests or inquiries",
              ],
              note_before: "We do ",
              note_highlight: "not",
              note_after:
                " use your data for advertising purposes or sell your information to third parties.",
            },

            sharing: {
              title: "3. Sharing of Information",
              points: [
                {
                  bold: "With salon staff",
                  text: " for managing bookings and queues",
                },
                {
                  bold: "With service providers",
                  text: " (e.g., SMS providers) only to deliver messages or technical support",
                },
                {
                  bold: "When required by law",
                  text: " to comply with legal obligations or protect our users' rights",
                },
              ],
              footer:
                "We ensure all third parties follow strict confidentiality and data protection standards.",
            },

            security: {
              title: "4. Data Security",
              points: [
                "Secure servers and encrypted connections",
                "Role-based access control for staff",
                "Regular app updates to patch security vulnerabilities",
              ],
              footer:
                "However, no mobile app is 100% secure. Use the app responsibly and update it regularly.",
            },

            rights: {
              title: "5. Your Rights and Choices",
              points: [
                "View and update your profile information",
                "Cancel your bookings or remove yourself from the queue",
                "Request deletion of your account and personal data",
                "Contact us if you believe your data has been misused",
              ],
              contact_before:
                "To update or delete your data, please contact us at ",
              contact_highlight: "[Your Support Email]",
              contact_after: " or use the profile settings in the app.",
            },

            children: {
              title: "6. Children's Privacy",
              description:
                "Our app is intended for users aged 13 and above. We do not knowingly collect data from children under 13. If you believe a child’s data has been submitted, contact us immediately for removal.",
            },

            updates: {
              title: "7. Changes to This Policy",
              points: [
                "We may update this Privacy Policy from time to time to reflect changes in technology, law, or business operations.",
                "We will notify users of significant changes via the app",
                "Continued use of the app means you accept the updated policy",
              ],
            },
          },
        },
      },
      licenses: {
        header: "End User License Agreement",

        content: {
          effectiveDate_label: "Effective Date:",
          effectiveDate_value: "04-07-2025",

          appName_label: "App Name:",
          appName_value: "iqbook",

          intro1:
            "This End User License Agreement (“Agreement”) is a legal agreement between you (“User”, “you”, or “your”) and ",
          intro1_highlight: "iqbook",
          intro1_after: ", governing your use of the ",
          intro1_app_highlight: "iqbook",
          intro1_end: " mobile application (“App”).",

          intro2:
            "By downloading, installing, or using the app, you agree to be bound by the terms of this license.",

          sections: {
            licenseGrant: {
              title: "1. License Grant",
              allowPoints: [
                "Download and install the app on your personal device",
                "Use the app solely for booking appointments, joining the salon queue, and managing your salon visits",
              ],
              restrictionText: "You may not:",
              restrictPoints: [
                "Copy, modify, or distribute the app or its content",
                "Reverse engineer, decompile, or attempt to extract source code",
                "Use the app for illegal purposes or outside the scope of permitted use",
              ],
            },

            ownership: {
              title: "2. Ownership and Intellectual Property",
              description_before:
                "All content, design, code, and trademarks within the app are owned by ",
              highlight: "iqbook",
              description_after:
                " or its licensors. This license does not grant you ownership of the app or its content—only the right to use it under the conditions of this Agreement.",
            },

            updates: {
              title: "3. Updates and Modifications",
              description1:
                "We may release updates or improvements to the app. These updates may be automatic or manual. You agree to install such updates for continued access and security.",
              description2:
                "We reserve the right to modify or discontinue the app at any time without notice.",
            },

            termination: {
              title: "4. Termination",
              description:
                "This license will remain in effect until terminated. We may suspend or terminate your access if you:",
              points: [
                "Violate this agreement",
                "Misuse the app",
                "Engage in fraudulent, abusive, or harmful behavior",
              ],
              footer:
                "Upon termination, you must delete the app from your device and stop using it immediately.",
            },

            warranty: {
              title: "5. Disclaimer of Warranty",
              description1_before: "The app is provided ",
              description1_highlight: '"as is"',
              description1_after:
                " without warranties of any kind. We do not guarantee that the app will be error-free or always available.",
              description2:
                "To the fullest extent permitted by law, we disclaim all warranties, express or implied.",
            },

            liability: {
              title: "6. Limitation of Liability",
              points: [
                "Any damages resulting from the use or inability to use the app",
                "Loss of data, missed appointments, or queue disruptions",
                "Any indirect or consequential damages",
              ],
              footer: "Your use of the app is at your own risk.",
            },
          },
        },
      },
    },
    notification: {
      header: "Notification",
    },
    dashboard: {
      card: {
        title: "Join the virtual queue or book an appointment.",
        joinQueue: "Join Queue",
        book: "Book",
        cancel: "Cancel",
      },
      hint: {
        label: "Salon Info",
        readMore: "Read more",
        readLess: "Read less",
        newUpdate: "New update",
        latest: "Lastest:",
        update: "Update",
      },
      status: {
        label: "Live Queue Status",
        system: "System",
        nextIn: "Next In",
        onDuty: "On Duty",
        inQueue: "In Queue",
        online: "Online",
        offline: "Offline",
      },
      barber: {
        barbers: "Barbers",
        stylists: "Stylists",
        onDuty: "On Duty",
        no: "No",
        available: "available",
        seeAll: "See all",
        online: "Online",
        offline: "Offline",
      },

      errorStatesAndApi: {
        permissionNotGranted:
          "Permission not granted to get push token for push notification!",
        projectIDNotFound: "Project ID not found",
        physicalDevicePushNotification:
          "Must use physical device for push notifications",
      },
    },
    queuelist: {
      header: "Live Queue",
      barber: "BARBER",
      stylist: "STYLIST",
      customer: "CUSTOMER",
      posWait: "POS / WAIT",
      joinQueue: "Join Queue",
      empty: {
        heading: "The queue is empty",
        subHeading:
          "There's no one in the queue right now. Be the first to join!",
        joinQueue: "Join Queue",
      },
    },
    joinpopup: {
      header: "Join Queue",
      singleJoin: {
        label: "Single Join",
        subHeader:
          "Join the queue as a single customer. This option is for individuals waiting alone for salon services.",
        buttonText: "Single Join",
      },
      groupJoin: {
        label: "Group Join",
        subHeader:
          "Join the queue with multiple people at once. Ideal for friends or family members visiting the salon together.",
        buttonText: "Group Join",
      },
    },
    joinQueueTypeModal: {
      header: "Select Option",
      barber: "Barber",
      services: "Services",
    },
    singleJoinServicesBarber: {
      header: "Single Join",
      barbers: "Barbers",
      stylists: "Stylists",
      no: "No",
      info1: "Unfortunately, there are no available",
      info2: "for the selected services at the moment.",
      chooseServicesAgain: "Choose Services Again",
      continue: "Continue",

      alertBox: {
        alertOne: {
          header: "Confirm",
          subHeader: "If you go back now, your queue will be reset",
          cancel: "Cancel",
          ok: "Ok",
        },
      },
    },
    singleJoinBarberServices: {
      header: "Single Join (Services)",
      searchInput: {
        placeholder: "Search services by category",
      },
      service: "service",
      services: "services",
      continue: "Continue",
    },
    singleJoin: {
      header: "Single Join (Services)",
      searchInput: {
        placeholder: "Search services by category",
      },
      service: "service",
      services: "services",
      continue: "Continue",

      alertBox: {
        alertOne: {
          header: "Confirm",
          subHeader: "If you go back now, your queue will be reset",
          cancel: "Cancel",
          ok: "OK",
        },
      },
    },
    singleJoinBarber: {
      header: "Single Join",
      barbers: "Barbers",
      stylists: "Stylists",
      no: "No",
      info1: "Unfortunately, there are no available",
      info2: "for the selected services at the moment.",
      chooseServiceAgain: "Choose Services Again",
      service: "service",
      services: "services",
      continue: "Continue",
    },
    singleJoinModal: {
      header: "Confirm Selection",
      subHeader: "Are you sure you want to proceed ?",
      selectedBarber: "Selected Barber",
      service: "service",
      services: "services",
      paymentBreakdown: "Payment Breakdown",
      totalAmount: "Total Amount",
      payNow: "Pay Now",
      deposit: "Deposit",
      payAtSalon: "Pay at Salon",
      proceedToPayment: "Proceed to Payment",
      confirmBooking: "Confirm Booking",
      goBack: "Go Back",

      alertBox: {
        alertOne: {
          header: "Notice",
          ok: "OK",
        },
        alertTwo: {
          header: "Payment failed",
          subHeader: "Something went wrong",
        },
      },

      errorStatesAndApi: {
        paymentInitializationFailed: "Payment initialization failed",
        invalidStripeError: "Invalid Stripe response",
      },
    },


    singleJoinSuccessPage: {
      header: "Queue Joined!",
      subHeader:
        "You have successfully joined the queue. You will be notified when it's your turn.",
      goToLive: "Go to Live Queue",
      goBackHome: "Go back to home",
    },
    groupHostMemberModal: {
      header: "Host Member",
      memberInput: {
        placeholder: "Enter member's name",
      },
      cancel: "Cancel",
      add: "Add",

      errorStatesAndApi: {
        memberRequired: "Member name is required",
        memberLeastCharecters: "Member name must be at least 2 characters",
        memberMostCharecters: "Member name must be at most 20 characters",
      },
    },
    groupJoin: {
      header: "Group Join (Services)",
      searchInput: {
        placeholder: "Search services by category",
      },
      service: "service",
      services: "services",
      continue: "Continue",

      alertBox: {
        header: "Discard group join data ?",
        subHeader:
          "All selected members will be cleared, and the group join information will be reset.",
        cancel: "Cancel",
        ok: "OK",
      },
    },
    groupJoinBarber: {
      header: "Group Join (Stylists)",
      empty: {
        header: "No Stylists",
        subHeader:
          "Unfortunately, there are no available stylists for the selected services at the moment.",
        chooseServicesAgain: "Choose Services Again",
      },
      service: "service",
      services: "services",
      continue: "Continue",
    },
    groupJoinMembers: {
      header: "Group Members",
      you: "You",
      host: "(Host)",
      ready: "Ready",
      services: "Services:",
      stylist: "Stylist:",
      subtotal: "Subtotal:",
      addMember: "Add Member",
      member: "member",
      members: "members",
      joinQueue: "Join Queue",

      alertBox: {
        alertOne: {
          header: "Discard group join data ?",
          subHeader:
            "All selected members will be cleared, and the group join information will be reset.",
          cancel: "Cancel",
          ok: "OK",
        },
      },
    },
    groupAddMemberModal: {
      header: "Add New Member",
      memberInput: {
        placeholder: "Enter member's name",
      },
      cancel: "Cancel",
      add: "Add",

      errorStatesAndApi: {
        memberRequired: "Member name is required",
        memberLeastCharecters: "Member name must be at least 2 characters",
        memberMostCharecters: "Member name must be at most 20 characters",
      },
    },
    groupJoinModal: {
      header: "Group Booking",
      subHeader: "Please review your group details",
      members: "Members",
      services: "Services",
      time: "Time",
      paymentBreakdown: "Payment Breakdown",
      pricingSummary: "Pricing Summary",
      totalAmount: "Total Amount",
      payNow: "Pay Now",
      deposit: "Deposit",
      remainingBalance: "Remaining Balance",
      proceedToPayment: "Proceed to Payment",
      confirmGroupBooking: "Confirm Group Booking",
      goBack: "Go Back",

      errorStatesAndApi: {
        paymentInitializationFailed: "Payment initialization failed",
        invalidStripeError: "Invalid Stripe response",
      },

      alertBox: {
        alertOne: {
          header: "Notice",
          ok: "OK",
        },
        alertTwo: {
          header: "Payment failed",
          subHeader: "Something went wrong",
        },
      },
    },
    groupJoinSuccessPage: {
      header: "Queue Joined!",
      subHeader: "Your group has successfully joined the queue.",
      goToLiveQueue: "Go to Live Queue",
      goBackToHome: "Go back to home",
    },
    salon: {
      details: "Details",
      services: "Services",
      barbers: "Barbers",
      stylists: "Stylists",
      description: "Description",
      contactUs: "Contact Us",
      anyQuestionInfo: "If you have any questions",
      location: "Location",
      followUsOn: "Follow us on",
      socialLinks: "Social links",
      exploreAll: "Explore all",
      no: "No",
      available: "available",

      favouriteToastSuccess: "Successfully added to favourites",
      favouriteToastError: "Something went wrong",
    },
    appointment: {
      header: "Appointments",
      noAppointment: {
        header: "No Appointments",
        subHeader: "You have no appointments to show.",
        buttonText: "Book Appointment",
      },
      bookAgain: "Book again",
      services: "services",
      service: "service",
      upcoming: "Upcoming",
      past: "Past",
      next: "Next"
    },



    appointmentCalender: {
      header: "Book Appointment",
      services: "Services",
      more: "more",
      barber: "Barber",
      stylist: "Stylist",
      services: "Services",
      date: "Date",
      time: "Time",
      remove: "Remove",
      add: "Add",
      no: "No",
      available: "available",
      noServicesAvailable: "No services available",
      notifyCancelation: "Notify me when there is a cancellation",
      selectBarberOrStylist: "Please select barber/stylist",
      selectDate: "Please select date",
      salonClosed: "The salon is closed on this day.",
      selectedStylistOrBarberUnavailable:
        "The selected stylist/barber is unavailable on this day.",
      appointmentNote: {
        placeholder: "Enter your appointment note",
      },
      step: "Step",
      of: "of",
      stepNumber: 4,
      prev: "Prev",
      finish: "Finish",
      next: "Next",

      errorStatesAndApi: {
        selectService: "Please select a service",
        selectStylist: "Please select a stylist",
        selectBarber: "Please select a barber",
        selectTimeslot: "Please select a timeslot",
        selectDate: "Please select a date",
      },

      alertBox: {
        header: "Confirm",
        subHeader:
          "If you go back now, your booking appointment progress will be lost. Are you sure you want to exit ?",
        cancel: "Cancel",
        ok: "OK",
      },
    },
    appointmentCalenderModal: {
      header: "Confirm Appointment",
      subHeader: "Please review your booking details",
      serviceProvider: "Service Provider",
      service: "service",
      services: "services",
      date: "Date",
      time: "Time",
      paymentBreakdown: "Payment Breakdown",
      totalAmount: "Total Amount",
      payNow: "Pay Now",
      deposit: "Deposit",
      remainingBalance: "Remaining Balance",
      yourNote: "Your Note",
      cancellationPolicy: {
        header: "Cancellation Policy",
        subHeader:
          "Cancellations within 24 hours incur a 50% fee. Please arrive 5 minutes early.",
      },
      proceedToPayment: "Proceed to Payment",
      confirmBooking: "Confirm Booking",
      goBack: "Go Back",

      errorStatesAndApi: {
        noGoogleCalender: "No valid Google calendar found.",
        paymentInitializationFailed: "Payment initialization failed",
        invalidStripeError: "Invalid Stripe response",
      },

      alertBox: {
        alertOne: {
          header: "Permission Denied",
          subHeader: "Please enable calendar access in settings.",
        },
        alertTwo: {
          header: "Success",
          subHeader: "Appointment created! Check your calendar.",
        },
        alertThree: {
          header: "Error",
        },
        alertFour: {
          header: "Notice",
          ok: "OK",
        },
        alertFive: {
          header: "Payment failed",
          subHeader: "Something went wrong",
        },
      },
    },
    appointmentSuccessPage: {
      appointmentBooked: "Appointment Booked !",
      appointmentUpdated: "Appointment Updated !",
      bookedInfo:
        "You have successfully booked the appointment. You will be notified when it's your turn.",
      updatedInfo:
        "You have successfully updated the appointment. You will be notified when it's your turn.",
      reminder: "Reminder:",
      cancelationReminder:
        "edits or cancellations made less than 24 hours before your appointment will be subject to a 50% fee.",
      reachInfo: "Kindly reach 5 minutes early for a seamless service.",
      goToAppointments: "Go to Appointments",
      goBackToHome: "Go back to home",
    },
    appointmentPop: {
      header: "Manage Appointment",
      service: "service",
      services: "services",
      cancellation: {
        header: "Cancellation Policy",
        subHeader:
          "Cancellations within 24 hours incur a 50% fee. Please arrive 5 minutes early.",
      },
      cancel: "Cancel",
      edit: "Edit",

      alertBox: {
        alertOne: {
          header: "Delete Appointment",
          subHeader: "Are you sure you want to delete this appointment ?",
          cancel: "Cancel",
          confirm: "Confirm",
        },
        alertTwo: {
          header: "Warning !",
          ok: "OK",
        },
        alertThree: {
          header: "Permission Denied",
          subHeader: "Please enable calendar access in settings.",
        },
      },
    },
    appointmentpopup: {
      header: "Booking options",
      selectServices: {
        header: "Select Services First",
        subHeader:
          "Choose the services you need first. After selecting services, you'll see a list of barbers who provide those services.",
        selectServices: "Select Services",
      },
      selectBarber: {
        header: "Select Barber First",
        subHeader:
          "Choose a barber first. You'll then see the list of services offered by that barber and can select what you want.",
        selectBarber: "Select Barber",
      },
    },
    editAppointmentCalender: {
      header: "Edit Appointment",
      services: "Services",
      more: "more",
      barber: "Barber",
      stylist: "Stylist",
      services: "Services",
      date: "Date",
      time: "Time",
      remove: "Remove",
      add: "Add",
      no: "No",
      available: "available",
      noServicesAvailable: "No services available",
      notifyCancelation: "Notify me when there is a cancellation",
      selectBarberOrStylist: "Please select barber/stylist",
      selectDate: "Please select date",
      salonClosed: "The salon is closed on this day.",
      selectedStylistOrBarberUnavailable:
        "The selected stylist/barber is unavailable on this day.",
      appointmentNote: {
        placeholder: "Enter your appointment note",
      },
      step: "Step",
      of: "of",
      stepNumber: 2,
      prev: "Prev",
      finish: "Finish",
      next: "Next",

      errorStatesAndApi: {
        selectDate: "Please select a date",
        selectTimeslot: "Please select a timeslot",
      },

      alertBox: {
        alertOne: {
          header: "Confirm",
          subHeader:
            "If you go back now, your edit appointment progress will be lost. Are you sure you want to exit ?",
          cancel: "Cancel",
          ok: "OK",
        },
      },
    },
    editAppointmentCalenderModal: {
      header: "Confirm Appointment",
      subHeader: "Please review your booking details",
      serviceProvider: "Service Provider",
      service: "service",
      services: "services",
      date: "Date",
      time: "Time",
      paymentBreakdown: "Payment Breakdown",
      totalAmount: "Total Amount",
      payNow: "Pay Now",
      deposit: "Deposit",
      remainingBalance: "Remaining Balance",
      yourNote: "Your Note",
      cancellationPolicy: {
        header: "Cancellation Policy",
        subHeader:
          "Cancellations within 24 hours incur a 50% fee. Please arrive 5 minutes early.",
      },
      proceedToPayment: "Proceed to Payment",
      saveBooking: "Save Booking",
      confirmBooking: "Confirm Booking",
      goBack: "Go Back",

      errorStatesAndApi: {
        googleCalenderNotFound: "No valid Google calendar found.",
      },

      alertBox: {
        alertOne: {
          header: "Permission Denied",
          subHeader: "Please enable calendar access in settings.",
        },
        alertTwo: {
          header: "Success",
          subHeader: "Appointment updated! Please check your calendar.",
        },
        alertThree: {
          header: "Error",
          subHeader: "Appointment event not found !",
        },
        alertFour: {
          header: "Error",
        },
        alertFive: {
          header: "Notice",
          ok: "OK",
        },
      },
    },
  },
};
