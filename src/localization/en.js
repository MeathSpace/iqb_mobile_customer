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
    },
    forgotPassword: {
      header: "What's your email ?",
      subHeader: "Enter your email address to reset your password.",
      email: { label: "Email", placeholder: "Enter your email" },
      continue: "Continue",
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
    },
  },

  protected: {
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
    },
    myFavourites: {
      header: "My Favorites",
      error: {
        header: "No Favourite",
        subHeader: "You don't have any favourite salon",
      },
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
  },
};
