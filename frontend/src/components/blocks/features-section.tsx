"use client";

import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    features: Feature[];
  };
}

export default function FeaturesSection({ content }: FeaturesSectionProps) {
  const { heading, subheading, features } = content;

  if (!features || features.length === 0) return null;

  return (
    <section id="features" className="section-spacing">
      <div className="container-wide">
        {(heading || subheading) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {subheading && (
              <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
                {subheading}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {heading}
              </h2>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative p-8 rounded-xl bg-card border border-border card-hover"
            >
              <div className="relative z-10">
                {feature.icon && (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-6">
                    {feature.icon}
                  </div>
                )}

                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
