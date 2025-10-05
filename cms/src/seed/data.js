/**
 * Seed data for Strapi CMS
 * Pages, Posts in English and Marathi
 */

module.exports = {
  // ============ PAGES ============
  pages: {
    en: [
      {
        title: "Home",
        pathName: "/",
        blocks: [
          {
            __component: "blocks.hero",
            title: "Production-Ready Next.js Self-Hosting",
            subtitle: "The Complete Guide",
            description: "Deploy Next.js 15 with confidence. Docker-optimized builds, Redis caching, tag-based invalidation, and enterprise-grade monitoring - all in one place.",
            ctaText: "Explore Posts",
            ctaLink: "/en/posts",
            useSparkles: true,
          },
          {
            __component: "blocks.features",
            heading: "Why Self-Host?",
            subheading: "Key Benefits",
            features: [
              {
                title: "79% Smaller Images",
                description: "Multi-stage Docker builds reduce image size from 850MB to 180MB. Faster deployments, lower costs.",
                icon: "🐳",
              },
              {
                title: "Redis-Powered ISR",
                description: "Custom cache handler for Incremental Static Regeneration. Shared cache across all instances.",
                icon: "⚡",
              },
              {
                title: "Tag-Based Invalidation",
                description: "Surgical cache updates via CMS webhooks. No more full rebuilds - just invalidate what changed.",
                icon: "🎯",
              },
              {
                title: "i18n Ready",
                description: "Built-in internationalization with English and Marathi. Locale detection and seamless switching.",
                icon: "🌐",
              },
              {
                title: "Health Monitoring",
                description: "Production-ready health checks, Prometheus metrics, and graceful degradation patterns.",
                icon: "💓",
              },
              {
                title: "CMS Powered",
                description: "Strapi v4 headless CMS with dynamic zones. Edit content without touching code.",
                icon: "📝",
              },
            ],
          },
          {
            __component: "blocks.banner",
            title: "Ready to Take Control?",
            subtitle: "Stop paying per-seat. Self-host with confidence using battle-tested patterns from production deployments.",
            ctaText: "Start Learning",
            ctaLink: "/en/posts",
          },
        ],
        seo: {
          metaTitle: "Next.js Self-Hosting Guide",
          metaDescription: "Complete guide to self-hosting Next.js 15 with Docker, Redis caching, and Strapi CMS. Reduce costs by 70% with enterprise-grade infrastructure.",
        },
      },
      {
        title: "About",
        pathName: "/about",
        blocks: [
          {
            __component: "blocks.hero",
            title: "Why Self-Host Next.js?",
            subtitle: "The Complete Picture",
            description: "Control your infrastructure, your data, and your costs. No vendor lock-in, no surprises.",
          },
          {
            __component: "blocks.rich-text",
            body: "## The Self-Hosting Advantage\n\nWhile platforms like Vercel offer incredible developer experience, self-hosting gives you something equally valuable: **complete control**.\n\n### What You Get\n\n- **Cost Predictability**: Fixed infrastructure costs, no per-seat pricing\n- **Data Residency**: Keep data in your region for compliance\n- **Custom Infrastructure**: Integrate with existing systems\n- **No Rate Limits**: Scale without arbitrary restrictions\n- **Full Observability**: Your metrics, your dashboards, your alerts\n\n## Our Tech Stack\n\n- **Next.js 15** - App Router with React Server Components\n- **Strapi v4** - Headless CMS with dynamic zones\n- **Redis** - Custom cache handler for ISR\n- **Docker** - Multi-stage optimized builds\n- **Nginx** - Reverse proxy with SSL termination",
          },
          {
            __component: "blocks.faq",
            title: "Frequently Asked Questions",
            faqs: [
              {
                question: "Is this production-ready?",
                answer: "Absolutely. This architecture is based on patterns used in production at companies handling millions of requests per day. The Docker optimization, Redis caching, and health check patterns are battle-tested.",
              },
              {
                question: "Why not just use Vercel?",
                answer: "Vercel is excellent for many use cases. Self-hosting makes sense when you need cost predictability, data residency compliance, custom infrastructure integration, or want to avoid vendor lock-in. It's not either-or - many teams use both.",
              },
              {
                question: "How much can I save?",
                answer: "Typical savings range from 50-80% for medium to large applications. A $500/month Vercel bill often becomes $100-150 on self-hosted infrastructure, especially when running multiple environments.",
              },
              {
                question: "Is Redis required?",
                answer: "Redis is optional but highly recommended for production. Without it, each server instance has its own cache. Redis enables shared caching across instances and survives container restarts.",
              },
              {
                question: "Can I use a different CMS?",
                answer: "Yes! The architecture works with any headless CMS - Contentful, Sanity, Prismic, or even a custom API. Just update the fetch utilities and webhook handlers.",
              },
            ],
          },
          {
            __component: "blocks.banner",
            title: "Ready to Dive Deeper?",
            subtitle: "Explore our step-by-step tutorials covering everything from Docker basics to advanced Redis caching.",
            ctaText: "Read the Blog",
            ctaLink: "/en/posts",
          },
        ],
        seo: {
          metaTitle: "About | Self-Host Next.js",
          metaDescription: "Learn the benefits of self-hosting Next.js: cost savings, data control, and enterprise-grade infrastructure without vendor lock-in.",
        },
      },
      {
        title: "Posts",
        pathName: "/posts",
        blocks: [
          {
            __component: "blocks.hero",
            title: "Learn Self-Hosting",
            subtitle: "Tutorials & Guides",
            description: "Step-by-step guides covering Docker optimization, Redis caching, tag-based invalidation, and production hardening.",
          },
          {
            __component: "blocks.post-list",
            title: "Featured Articles",
            subtitle: "From basics to advanced patterns - everything you need to deploy with confidence",
          },
        ],
        seo: {
          metaTitle: "Blog | Self-Hosting Tutorials",
          metaDescription: "Comprehensive tutorials on Docker optimization, Redis caching, ISR, and production deployment for Next.js applications.",
        },
      },
      {
        title: "FAQ Examples",
        pathName: "/faq-examples",
        blocks: [
          {
            __component: "blocks.hero",
            title: "FAQ SEO Patterns",
            subtitle: "Good vs Bad Implementation",
            description: "Compare SEO-friendly FAQ patterns with common anti-patterns. Learn how to structure FAQs for maximum search engine visibility.",
            useSparkles: false,
          },
          {
            __component: "blocks.rich-text",
            body: "## Understanding FAQ SEO\n\nThis page demonstrates two different approaches to building FAQ accordions:\n\n### ❌ Bad Pattern: Conditional Rendering\n- FAQ answers are NOT in server HTML\n- Google cannot crawl the content\n- Poor SEO performance\n- Content only visible after JavaScript loads\n\n### ✅ Good Pattern: CSS-Based Visibility\n- FAQ answers ARE in server HTML\n- Google can crawl all content\n- Excellent SEO performance\n- Content accessible without JavaScript\n\nScroll down to see both implementations side-by-side.",
          },
          {
            __component: "blocks.faq-bad",
            title: "Frequently Asked Questions",
            faqs: [
              {
                question: "Is this production-ready?",
                answer: "Absolutely. This architecture is based on patterns used in production at companies handling millions of requests per day. The Docker optimization, Redis caching, and health check patterns are battle-tested.",
              },
              {
                question: "Why not just use Vercel?",
                answer: "Vercel is excellent for many use cases. Self-hosting makes sense when you need cost predictability, data residency compliance, custom infrastructure integration, or want to avoid vendor lock-in. It's not either-or - many teams use both.",
              },
              {
                question: "How much can I save?",
                answer: "Typical savings range from 50-80% for medium to large applications. A $500/month Vercel bill often becomes $100-150 on self-hosted infrastructure, especially when running multiple environments.",
              },
            ],
          },
          {
            __component: "blocks.faq-good",
            title: "Frequently Asked Questions",
            faqs: [
              {
                question: "Is this production-ready?",
                answer: "Absolutely. This architecture is based on patterns used in production at companies handling millions of requests per day. The Docker optimization, Redis caching, and health check patterns are battle-tested.",
              },
              {
                question: "Why not just use Vercel?",
                answer: "Vercel is excellent for many use cases. Self-hosting makes sense when you need cost predictability, data residency compliance, custom infrastructure integration, or want to avoid vendor lock-in. It's not either-or - many teams use both.",
              },
              {
                question: "How much can I save?",
                answer: "Typical savings range from 50-80% for medium to large applications. A $500/month Vercel bill often becomes $100-150 on self-hosted infrastructure, especially when running multiple environments.",
              },
            ],
          },
        ],
        seo: {
          metaTitle: "FAQ SEO Patterns | Good vs Bad Implementation",
          metaDescription: "Compare SEO-friendly FAQ patterns with common anti-patterns. Learn how to structure FAQs for maximum search engine visibility.",
        },
      },
    ],
    mr: [
      {
        title: "मुख्यपृष्ठ",
        pathName: "/",
        blocks: [
          {
            __component: "blocks.hero",
            title: "प्रोडक्शन-रेडी Next.js स्व-होस्टिंग",
            subtitle: "संपूर्ण मार्गदर्शक",
            description: "आत्मविश्वासाने Next.js 15 डिप्लॉय करा. Docker-ऑप्टिमाइझ्ड बिल्ड्स, Redis कॅशिंग, टॅग-बेस्ड इनव्हॅलिडेशन आणि एंटरप्राइझ-ग्रेड मॉनिटरिंग - सर्व एकाच ठिकाणी.",
            ctaText: "लेख पहा",
            ctaLink: "/mr/posts",
            useSparkles: true,
          },
          {
            __component: "blocks.features",
            heading: "स्व-होस्ट का करावे?",
            subheading: "मुख्य फायदे",
            features: [
              {
                title: "79% लहान इमेजेस",
                description: "मल्टी-स्टेज Docker बिल्ड्स इमेज साइज 850MB वरून 180MB पर्यंत कमी करतात.",
                icon: "🐳",
              },
              {
                title: "Redis-पॉवर्ड ISR",
                description: "इंक्रीमेंटल स्टॅटिक रीजनरेशनसाठी कस्टम कॅश हँडलर. सर्व इन्स्टन्सेसवर शेअर्ड कॅश.",
                icon: "⚡",
              },
              {
                title: "टॅग-बेस्ड इनव्हॅलिडेशन",
                description: "CMS वेबहुक्सद्वारे सर्जिकल कॅश अपडेट्स. फक्त बदललेले इनव्हॅलिडेट करा.",
                icon: "🎯",
              },
              {
                title: "i18n तयार",
                description: "इंग्रजी आणि मराठीसह अंगभूत आंतरराष्ट्रीयीकरण. लोकेल डिटेक्शन आणि सहज स्विचिंग.",
                icon: "🌐",
              },
              {
                title: "हेल्थ मॉनिटरिंग",
                description: "प्रोडक्शन-रेडी हेल्थ चेक्स, Prometheus मेट्रिक्स आणि ग्रेसफुल डिग्रेडेशन पॅटर्न्स.",
                icon: "💓",
              },
              {
                title: "CMS पॉवर्ड",
                description: "डायनॅमिक झोन्ससह Strapi v4 हेडलेस CMS. कोडला स्पर्श न करता कंटेंट एडिट करा.",
                icon: "📝",
              },
            ],
          },
          {
            __component: "blocks.banner",
            title: "नियंत्रण घ्यायला तयार?",
            subtitle: "प्रति-सीट पेमेंट थांबवा. प्रोडक्शन डिप्लॉयमेंट्समधून बॅटल-टेस्टेड पॅटर्न्स वापरून आत्मविश्वासाने स्व-होस्ट करा.",
            ctaText: "शिकणे सुरू करा",
            ctaLink: "/mr/posts",
          },
        ],
        seo: {
          metaTitle: "Next.js स्व-होस्टिंग मार्गदर्शक",
          metaDescription: "Docker, Redis कॅशिंग आणि Strapi CMS सह Next.js 15 स्व-होस्ट करण्याचे संपूर्ण मार्गदर्शक.",
        },
      },
      {
        title: "बद्दल",
        pathName: "/about",
        blocks: [
          {
            __component: "blocks.hero",
            title: "Next.js स्व-होस्ट का करावे?",
            subtitle: "संपूर्ण चित्र",
            description: "तुमचे इन्फ्रास्ट्रक्चर, तुमचा डेटा आणि तुमचे खर्च नियंत्रित करा. कोणताही व्हेंडर लॉक-इन नाही.",
          },
          {
            __component: "blocks.rich-text",
            body: "## स्व-होस्टिंगचा फायदा\n\nVercel सारख्या प्लॅटफॉर्म्स अविश्वसनीय डेव्हलपर अनुभव देतात, परंतु स्व-होस्टिंग तुम्हाला तितकेच मौल्यवान काहीतरी देते: **संपूर्ण नियंत्रण**.\n\n### तुम्हाला काय मिळते\n\n- **खर्च अंदाज**: निश्चित इन्फ्रास्ट्रक्चर खर्च, कोणतेही प्रति-सीट प्राइसिंग नाही\n- **डेटा रेसिडेन्सी**: अनुपालनासाठी तुमच्या प्रदेशात डेटा ठेवा\n- **कस्टम इन्फ्रास्ट्रक्चर**: विद्यमान सिस्टम्ससह एकत्रित करा\n- **कोणत्याही रेट लिमिट्स नाहीत**: मनमानी प्रतिबंधांशिवाय स्केल करा",
          },
          {
            __component: "blocks.faq",
            title: "वारंवार विचारले जाणारे प्रश्न",
            faqs: [
              {
                question: "हे प्रोडक्शन-रेडी आहे का?",
                answer: "नक्कीच. ही आर्किटेक्चर दररोज लाखो विनंत्या हाताळणाऱ्या कंपन्यांमध्ये प्रोडक्शनमध्ये वापरल्या जाणाऱ्या पॅटर्न्सवर आधारित आहे.",
              },
              {
                question: "Vercel का वापरू नये?",
                answer: "अनेक वापर प्रकरणांसाठी Vercel उत्कृष्ट आहे. जेव्हा तुम्हाला खर्च अंदाज, डेटा रेसिडेन्सी अनुपालन, कस्टम इन्फ्रास्ट्रक्चर एकत्रीकरण आवश्यक असते किंवा व्हेंडर लॉक-इन टाळायचे असते तेव्हा स्व-होस्टिंग अर्थपूर्ण आहे.",
              },
              {
                question: "मी किती बचत करू शकतो?",
                answer: "मध्यम ते मोठ्या अॅप्लिकेशन्ससाठी सामान्य बचत 50-80% असते. $500/महिना Vercel बिल सहसा स्व-होस्टेड इन्फ्रास्ट्रक्चरवर $100-150 होते.",
              },
              {
                question: "Redis आवश्यक आहे का?",
                answer: "Redis ऐच्छिक आहे परंतु प्रोडक्शनसाठी अत्यंत शिफारस केली जाते. त्याशिवाय, प्रत्येक सर्व्हर इन्स्टन्सचे स्वतःचे कॅश असते. Redis इन्स्टन्सेसवर शेअर्ड कॅशिंग सक्षम करते.",
              },
            ],
          },
          {
            __component: "blocks.banner",
            title: "खोलवर जायला तयार?",
            subtitle: "Docker बेसिक्स ते अॅडव्हान्स्ड Redis कॅशिंग पर्यंत सर्व काही कव्हर करणारे आमचे स्टेप-बाय-स्टेप ट्यूटोरियल्स एक्सप्लोर करा.",
            ctaText: "ब्लॉग वाचा",
            ctaLink: "/mr/posts",
          },
        ],
        seo: {
          metaTitle: "बद्दल | स्व-होस्टिंग मार्गदर्शक",
          metaDescription: "Next.js स्व-होस्टिंगचे फायदे जाणून घ्या: खर्च बचत, डेटा नियंत्रण आणि व्हेंडर लॉक-इनशिवाय एंटरप्राइझ-ग्रेड इन्फ्रास्ट्रक्चर.",
        },
      },
      {
        title: "लेख",
        pathName: "/posts",
        blocks: [
          {
            __component: "blocks.hero",
            title: "स्व-होस्टिंग शिका",
            subtitle: "ट्यूटोरियल्स आणि मार्गदर्शक",
            description: "Docker ऑप्टिमायझेशन, Redis कॅशिंग, टॅग-बेस्ड इनव्हॅलिडेशन आणि प्रोडक्शन हार्डनिंग कव्हर करणारे स्टेप-बाय-स्टेप मार्गदर्शक.",
          },
          {
            __component: "blocks.post-list",
            title: "वैशिष्ट्यीकृत लेख",
            subtitle: "बेसिक्स ते अॅडव्हान्स्ड पॅटर्न्स - आत्मविश्वासाने डिप्लॉय करण्यासाठी तुम्हाला आवश्यक असलेले सर्वकाही",
          },
        ],
        seo: {
          metaTitle: "ब्लॉग | स्व-होस्टिंग ट्यूटोरियल्स",
          metaDescription: "Next.js अॅप्लिकेशन्ससाठी Docker ऑप्टिमायझेशन, Redis कॅशिंग, ISR आणि प्रोडक्शन डिप्लॉयमेंटवर सर्वसमावेशक ट्यूटोरियल्स.",
        },
      },
      {
        title: "FAQ उदाहरणे",
        pathName: "/faq-examples",
        blocks: [
          {
            __component: "blocks.hero",
            title: "FAQ SEO पॅटर्न्स",
            subtitle: "चांगली vs वाईट अंमलबजावणी",
            description: "SEO-अनुकूल FAQ पॅटर्न्सची सामान्य अँटी-पॅटर्न्सशी तुलना करा. जास्तीत जास्त सर्च इंजिन दृश्यताासाठी FAQ कसे स्ट्रक्चर करावे ते शिका.",
            useSparkles: false,
          },
          {
            __component: "blocks.rich-text",
            body: "## FAQ SEO समजून घेणे\n\nहे पृष्ठ FAQ accordions बनवण्याच्या दोन वेगवेगळ्या पद्धती दर्शवते:\n\n### ❌ वाईट पॅटर्न: सशर्त रेंडरिंग\n- FAQ उत्तरे सर्व्हर HTML मध्ये नाहीत\n- Google सामग्री क्रॉल करू शकत नाही\n- खराब SEO कामगिरी\n- JavaScript लोड झाल्यानंतरच सामग्री दृश्यमान\n\n### ✅ चांगला पॅटर्न: CSS-आधारित दृश्यता\n- FAQ उत्तरे सर्व्हर HTML मध्ये आहेत\n- Google सर्व सामग्री क्रॉल करू शकतो\n- उत्कृष्ट SEO कामगिरी\n- JavaScript शिवाय सामग्री प्रवेशयोग्य",
          },
          {
            __component: "blocks.faq-bad",
            title: "वारंवार विचारले जाणारे प्रश्न",
            faqs: [
              {
                question: "हे प्रोडक्शन-रेडी आहे का?",
                answer: "नक्कीच. ही आर्किटेक्चर दररोज लाखो विनंत्या हाताळणाऱ्या कंपन्यांमध्ये प्रोडक्शनमध्ये वापरल्या जाणाऱ्या पॅटर्न्सवर आधारित आहे.",
              },
              {
                question: "Vercel का वापरू नये?",
                answer: "अनेक वापर प्रकरणांसाठी Vercel उत्कृष्ट आहे. जेव्हा तुम्हाला खर्च अंदाज, डेटा रेसिडेन्सी अनुपालन, कस्टम इन्फ्रास्ट्रक्चर एकत्रीकरण आवश्यक असते किंवा व्हेंडर लॉक-इन टाळायचे असते तेव्हा स्व-होस्टिंग अर्थपूर्ण आहे.",
              },
              {
                question: "मी किती बचत करू शकतो?",
                answer: "मध्यम ते मोठ्या अॅप्लिकेशन्ससाठी सामान्य बचत 50-80% असते. $500/महिना Vercel बिल सहसा स्व-होस्टेड इन्फ्रास्ट्रक्चरवर $100-150 होते.",
              },
            ],
          },
          {
            __component: "blocks.faq-good",
            title: "वारंवार विचारले जाणारे प्रश्न",
            faqs: [
              {
                question: "हे प्रोडक्शन-रेडी आहे का?",
                answer: "नक्कीच. ही आर्किटेक्चर दररोज लाखो विनंत्या हाताळणाऱ्या कंपन्यांमध्ये प्रोडक्शनमध्ये वापरल्या जाणाऱ्या पॅटर्न्सवर आधारित आहे.",
              },
              {
                question: "Vercel का वापरू नये?",
                answer: "अनेक वापर प्रकरणांसाठी Vercel उत्कृष्ट आहे. जेव्हा तुम्हाला खर्च अंदाज, डेटा रेसिडेन्सी अनुपालन, कस्टम इन्फ्रास्ट्रक्चर एकत्रीकरण आवश्यक असते किंवा व्हेंडर लॉक-इन टाळायचे असते तेव्हा स्व-होस्टिंग अर्थपूर्ण आहे.",
              },
              {
                question: "मी किती बचत करू शकतो?",
                answer: "मध्यम ते मोठ्या अॅप्लिकेशन्ससाठी सामान्य बचत 50-80% असते. $500/महिना Vercel बिल सहसा स्व-होस्टेड इन्फ्रास्ट्रक्चरवर $100-150 होते.",
              },
            ],
          },
        ],
        seo: {
          metaTitle: "FAQ SEO पॅटर्न्स | चांगली vs वाईट अंमलबजावणी",
          metaDescription: "SEO-अनुकूल FAQ पॅटर्न्सची सामान्य अँटी-पॅटर्न्सशी तुलना करा.",
        },
      },
    ],
  },

  // ============ POSTS ============
  posts: {
    en: [
      {
        title: "Getting Started with Next.js 15 Self-Hosting",
        slug: "getting-started-nextjs-15",
        pathName: "/posts/getting-started-nextjs-15",
        excerpt: "Your complete guide to setting up a production-ready Next.js 15 application for self-hosting. From standalone mode to Docker optimization.",
        publishedDate: "2024-12-20",
        readTime: "8",
        blocks: [
          {
            __component: "blocks.rich-text",
            body: "# Getting Started with Next.js 15 Self-Hosting\n\nSelf-hosting Next.js gives you complete control over your infrastructure while maintaining all the benefits of the framework.\n\n## Why Self-Host?\n\n- **Cost Control**: Predictable infrastructure costs\n- **Data Sovereignty**: Keep data in your region\n- **Custom Integration**: Connect with existing systems\n- **No Vendor Lock-in**: Deploy anywhere\n\n## Prerequisites\n\n- Node.js 18 or later\n- Docker and Docker Compose\n- Basic understanding of Next.js\n- A Linux server (Ubuntu 22.04 recommended)\n\n## Step 1: Enable Standalone Mode\n\nThe standalone output mode creates a self-contained build that includes only the necessary files:\n\n```javascript\n// next.config.js\nmodule.exports = {\n  output: 'standalone'\n}\n```\n\n## Step 2: Create an Optimized Dockerfile\n\nA multi-stage build reduces image size by 79%:\n\n```dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nCOPY --from=builder /app/public ./public\n\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```\n\n## What's Next?\n\nIn the following articles, we'll cover:\n- Docker optimization techniques\n- Redis caching for ISR\n- Tag-based cache invalidation\n- Production hardening\n\nStay tuned!",
          },
        ],
        seo: {
          metaTitle: "Getting Started with Next.js 15 Self-Hosting",
          metaDescription: "Learn how to set up Next.js 15 for self-hosting with Docker. Step-by-step guide from standalone mode to production deployment.",
        },
      },
      {
        title: "Docker Optimization: From 850MB to 180MB",
        slug: "docker-optimization-nextjs",
        pathName: "/posts/docker-optimization-nextjs",
        excerpt: "Master Docker optimization for Next.js applications. Multi-stage builds, layer caching, and production-ready patterns.",
        publishedDate: "2024-12-18",
        readTime: "10",
        blocks: [
          {
            __component: "blocks.rich-text",
            body: "# Docker Optimization for Next.js\n\nA typical Next.js Docker image can easily exceed 800MB. Here's how to reduce it to under 200MB.\n\n## The Problem\n\nLarge images cause:\n- **Slow deployments** - More data to transfer\n- **Higher storage costs** - Registry and container overhead\n- **Slower cold starts** - More time to pull and extract\n\n## The Solution: Multi-Stage Builds\n\n### Stage 1: Dependencies\n\nOnly install production dependencies:\n\n```dockerfile\nFROM node:18-alpine AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n```\n\n### Stage 2: Build\n\nBuild with all dependencies, then discard:\n\n```dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n```\n\n### Stage 3: Runner\n\nOnly copy what's needed:\n\n```dockerfile\nFROM node:18-alpine AS runner\nWORKDIR /app\n\n# Create non-root user\nRUN addgroup --system --gid 1001 nodejs\nRUN adduser --system --uid 1001 nextjs\n\n# Copy only necessary files\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static\nCOPY --from=builder --chown=nextjs:nodejs /app/public ./public\n\nUSER nextjs\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```\n\n## Results\n\n- **Before**: 850MB\n- **After**: 180MB\n- **Reduction**: 79%\n\n## Layer Caching Tips\n\n1. Copy `package.json` before source code\n2. Use `.dockerignore` to exclude node_modules\n3. Separate dependencies from build steps",
          },
        ],
        seo: {
          metaTitle: "Docker Optimization for Next.js",
          metaDescription: "Learn how to reduce Docker image size from 850MB to 180MB with multi-stage builds and layer caching optimization.",
        },
      },
      {
        title: "Redis Caching for Incremental Static Regeneration",
        slug: "redis-caching-isr",
        pathName: "/posts/redis-caching-isr",
        excerpt: "Implement a custom Redis cache handler for Next.js ISR. Shared caching, tag-based invalidation, and production patterns.",
        publishedDate: "2024-12-15",
        readTime: "12",
        blocks: [
          {
            __component: "blocks.rich-text",
            body: "# Redis Caching for ISR\n\nNext.js ISR (Incremental Static Regeneration) is powerful, but the default file-based cache doesn't work well with multiple server instances. Redis solves this.\n\n## Why Redis for ISR?\n\n- **Shared Cache**: All instances share the same cache\n- **Persistence**: Cache survives container restarts\n- **Tag Invalidation**: Invalidate related pages together\n- **High Performance**: Sub-millisecond reads\n\n## The Cache Handler API\n\nNext.js provides a simple API for custom cache handlers:\n\n```typescript\nexport default class CacheHandler {\n  async get(key: string) {\n    // Return cached value or null\n  }\n\n  async set(key: string, data: any, ctx: { tags: string[] }) {\n    // Store value with optional tags\n  }\n\n  async revalidateTag(tag: string) {\n    // Invalidate all entries with this tag\n  }\n}\n```\n\n## Implementation Highlights\n\n### 1. Key Prefixing\n\nPrefix keys to avoid collisions:\n\n```typescript\nconst PREFIX = 'next:cache:';\nconst key = `${PREFIX}${originalKey}`;\n```\n\n### 2. Tag Indexing\n\nStore reverse index for tag invalidation:\n\n```typescript\n// For each tag, store list of cache keys\nawait redis.sadd(`tag:${tag}`, cacheKey);\n```\n\n### 3. TTL Management\n\nRespect revalidation periods:\n\n```typescript\nif (ctx.revalidate) {\n  await redis.setex(key, ctx.revalidate, data);\n}\n```\n\n## Tag-Based Invalidation\n\nThe killer feature - invalidate all pages with a specific tag:\n\n```typescript\nasync revalidateTag(tag: string) {\n  const keys = await redis.smembers(`tag:${tag}`);\n  if (keys.length > 0) {\n    await redis.del(...keys);\n  }\n  await redis.del(`tag:${tag}`);\n}\n```\n\n## Next Steps\n\n- Connect this to CMS webhooks\n- Add monitoring and metrics\n- Implement failover patterns",
          },
        ],
        seo: {
          metaTitle: "Redis Caching for Next.js ISR",
          metaDescription: "Build a custom Redis cache handler for Next.js ISR with tag-based invalidation and production-ready patterns.",
        },
      },
    ],
    mr: [
      {
        title: "Next.js 15 स्व-होस्टिंग सुरू करणे",
        slug: "getting-started-nextjs-15",
        pathName: "/posts/getting-started-nextjs-15",
        excerpt: "स्व-होस्टिंगसाठी प्रोडक्शन-रेडी Next.js 15 अॅप्लिकेशन सेट करण्याचे तुमचे संपूर्ण मार्गदर्शक. स्टँडअलोन मोडपासून Docker ऑप्टिमायझेशनपर्यंत.",
        publishedDate: "2024-12-20",
        readTime: "8",
        blocks: [
          {
            __component: "blocks.rich-text",
            body: "# Next.js 15 स्व-होस्टिंग सुरू करणे\n\nNext.js स्व-होस्ट करणे तुम्हाला फ्रेमवर्कचे सर्व फायदे राखून तुमच्या इन्फ्रास्ट्रक्चरवर पूर्ण नियंत्रण देते.\n\n## स्व-होस्ट का करावे?\n\n- **खर्च नियंत्रण**: अंदाजित इन्फ्रास्ट्रक्चर खर्च\n- **डेटा सार्वभौमत्व**: डेटा तुमच्या प्रदेशात ठेवा\n- **कस्टम एकत्रीकरण**: विद्यमान सिस्टम्सशी कनेक्ट करा\n- **कोणताही व्हेंडर लॉक-इन नाही**: कुठेही डिप्लॉय करा\n\n## आवश्यकता\n\n- Node.js 18 किंवा नंतर\n- Docker आणि Docker Compose\n- Next.js ची मूलभूत समज\n- Linux सर्व्हर (Ubuntu 22.04 शिफारस केली जाते)\n\n## पायरी 1: स्टँडअलोन मोड सक्षम करा\n\nस्टँडअलोन आउटपुट मोड फक्त आवश्यक फाइल्स समाविष्ट करणारे स्वयं-निहित बिल्ड तयार करते:\n\n```javascript\n// next.config.js\nmodule.exports = {\n  output: 'standalone'\n}\n```",
          },
        ],
        seo: {
          metaTitle: "Next.js 15 स्व-होस्टिंग सुरू करणे",
          metaDescription: "Docker सह स्व-होस्टिंगसाठी Next.js 15 कसे सेट करावे ते शिका. स्टँडअलोन मोडपासून प्रोडक्शन डिप्लॉयमेंटपर्यंत स्टेप-बाय-स्टेप मार्गदर्शक.",
        },
      },
      {
        title: "Docker ऑप्टिमायझेशन: 850MB वरून 180MB पर्यंत",
        slug: "docker-optimization-nextjs",
        pathName: "/posts/docker-optimization-nextjs",
        excerpt: "Next.js अॅप्लिकेशन्ससाठी Docker ऑप्टिमायझेशन मास्टर करा. मल्टी-स्टेज बिल्ड्स, लेयर कॅशिंग आणि प्रोडक्शन-रेडी पॅटर्न्स.",
        publishedDate: "2024-12-18",
        readTime: "10",
        blocks: [
          {
            __component: "blocks.rich-text",
            body: "# Next.js साठी Docker ऑप्टिमायझेशन\n\nसामान्य Next.js Docker इमेज सहजपणे 800MB पेक्षा जास्त असू शकते. ते 200MB पेक्षा कमी कसे करायचे ते येथे आहे.\n\n## समस्या\n\nमोठ्या इमेजेसमुळे:\n- **धीमी डिप्लॉयमेंट्स** - ट्रान्सफर करण्यासाठी अधिक डेटा\n- **जास्त स्टोरेज खर्च** - रजिस्ट्री आणि कंटेनर ओव्हरहेड\n- **धीमी कोल्ड स्टार्ट्स** - पुल आणि एक्स्ट्रॅक्ट करण्यासाठी अधिक वेळ\n\n## समाधान: मल्टी-स्टेज बिल्ड्स\n\n### स्टेज 1: डिपेंडेन्सीज\n\nफक्त प्रोडक्शन डिपेंडेन्सीज इन्स्टॉल करा:\n\n```dockerfile\nFROM node:18-alpine AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n```\n\n## परिणाम\n\n- **पूर्वी**: 850MB\n- **नंतर**: 180MB\n- **कपात**: 79%",
          },
        ],
        seo: {
          metaTitle: "Docker ऑप्टिमायझेशन | Next.js",
          metaDescription: "मल्टी-स्टेज बिल्ड्स आणि लेयर कॅशिंग ऑप्टिमायझेशनसह Docker इमेज साइज 850MB वरून 180MB पर्यंत कसा कमी करायचा ते शिका.",
        },
      },
      {
        title: "ISR साठी Redis कॅशिंग",
        slug: "redis-caching-isr",
        pathName: "/posts/redis-caching-isr",
        excerpt: "Next.js ISR साठी कस्टम Redis कॅश हँडलर अंमलात आणा. शेअर्ड कॅशिंग, टॅग-बेस्ड इनव्हॅलिडेशन आणि प्रोडक्शन पॅटर्न्स.",
        publishedDate: "2024-12-15",
        readTime: "12",
        blocks: [
          {
            __component: "blocks.rich-text",
            body: "# ISR साठी Redis कॅशिंग\n\nNext.js ISR (इंक्रीमेंटल स्टॅटिक रीजनरेशन) शक्तिशाली आहे, परंतु डिफॉल्ट फाइल-बेस्ड कॅश अनेक सर्व्हर इन्स्टन्सेससह चांगले काम करत नाही. Redis हे सोडवते.\n\n## ISR साठी Redis का?\n\n- **शेअर्ड कॅश**: सर्व इन्स्टन्सेस एकच कॅश शेअर करतात\n- **पर्सिस्टेन्स**: कॅश कंटेनर रीस्टार्ट्स टिकून राहते\n- **टॅग इनव्हॅलिडेशन**: संबंधित पेजेस एकत्र इनव्हॅलिडेट करा\n- **उच्च कामगिरी**: सब-मिलिसेकंड रीड्स\n\n## कॅश हँडलर API\n\nNext.js कस्टम कॅश हँडलर्ससाठी एक सोपे API प्रदान करते:\n\n```typescript\nexport default class CacheHandler {\n  async get(key: string) {\n    // कॅश्ड व्हॅल्यू किंवा null परत करा\n  }\n\n  async set(key: string, data: any, ctx: { tags: string[] }) {\n    // ऐच्छिक टॅग्ससह व्हॅल्यू स्टोअर करा\n  }\n\n  async revalidateTag(tag: string) {\n    // या टॅगसह सर्व एंट्रीज इनव्हॅलिडेट करा\n  }\n}\n```",
          },
        ],
        seo: {
          metaTitle: "Redis कॅशिंग | Next.js ISR",
          metaDescription: "टॅग-बेस्ड इनव्हॅलिडेशन आणि प्रोडक्शन-रेडी पॅटर्न्ससह Next.js ISR साठी कस्टम Redis कॅश हँडलर बनवा.",
        },
      },
    ],
  },

  // ============ ABOUT (Single Type) ============
  about: {
    en: {
      title: "About Us",
      description: "Learn about the Next.js Self-Hosting Demo project",
      content: "This is a demonstration project showcasing production-ready self-hosting practices for Next.js 15 applications. Built with Docker, Redis, and Strapi CMS.",
      seo: {
        metaTitle: "About | Next.js Self-Hosting Demo",
        metaDescription: "Learn about our Next.js self-hosting project - production patterns from real deployments.",
      },
    },
    mr: {
      title: "आमच्याबद्दल",
      description: "Next.js स्व-होस्टिंग डेमो प्रकल्पाबद्दल जाणून घ्या",
      content: "हा Next.js 15 अॅप्लिकेशन्ससाठी प्रोडक्शन-रेडी स्व-होस्टिंग पद्धती दर्शवणारा प्रात्यक्षिक प्रकल्प आहे. Docker, Redis आणि Strapi CMS सह बनवलेले.",
      seo: {
        metaTitle: "बद्दल | Next.js स्व-होस्टिंग डेमो",
        metaDescription: "आमच्या Next.js स्व-होस्टिंग प्रकल्पाबद्दल जाणून घ्या - वास्तविक डिप्लॉयमेंट्समधून प्रोडक्शन पॅटर्न्स.",
      },
    },
  },

  // ============ ROUTES ============
  routes: [
    { path: "/", label: "Home", description: "Homepage" },
    { path: "/posts", label: "Posts", description: "Blog posts listing" },
    { path: "/about", label: "About", description: "About page" },
    { path: "/faq-examples", label: "FAQ Examples", description: "FAQ SEO patterns examples" },
  ],

  // ============ GLOBAL (Single Type) ============
  global: {
    en: {
      siteName: "Next.js Self-Hosting Guide",
      siteDescription: "Production-ready Next.js 15 with Docker, Redis, and Strapi CMS",
      navigation: {
        home: "Home",
        posts: "Posts",
        about: "About",
        faqExamples: "FAQ Examples",
        readMore: "Read More",
        backToHome: "Back to Home",
        backToPosts: "Back to Posts",
        loading: "Loading...",
        notFound: "Not Found",
        noPostsFound: "No posts found.",
      },
      // Navigation items will be populated after routes are seeded
      navigationItems: [],
      defaultSeo: {
        metaTitle: "Next.js Self-Hosting Guide",
        metaDescription: "Complete guide to self-hosting Next.js applications with Docker optimization, Redis caching, and enterprise patterns.",
      },
    },
    mr: {
      siteName: "Next.js स्व-होस्टिंग मार्गदर्शक",
      siteDescription: "Docker, Redis आणि Strapi CMS सह प्रोडक्शन-रेडी Next.js 15",
      navigation: {
        home: "मुख्यपृष्ठ",
        posts: "लेख",
        about: "बद्दल",
        faqExamples: "FAQ उदाहरणे",
        readMore: "अधिक वाचा",
        backToHome: "मुख्यपृष्ठावर परत",
        backToPosts: "लेखांवर परत",
        loading: "लोड होत आहे...",
        notFound: "सापडले नाही",
        noPostsFound: "लेख सापडले नाहीत.",
      },
      // Navigation items will be populated after routes are seeded
      navigationItems: [],
      defaultSeo: {
        metaTitle: "Next.js स्व-होस्टिंग मार्गदर्शक",
        metaDescription: "Docker ऑप्टिमायझेशन, Redis कॅशिंग आणि एंटरप्राइझ पॅटर्न्ससह Next.js अॅप्लिकेशन्स स्व-होस्ट करण्याचे संपूर्ण मार्गदर्शक.",
      },
    },
  },
};
