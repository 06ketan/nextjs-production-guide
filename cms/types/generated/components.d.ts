import type { Attribute, Schema } from '@strapi/strapi';

export interface BlocksBanner extends Schema.Component {
  collectionName: 'components_blocks_banners';
  info: {
    description: 'Banner section with CTA';
    displayName: 'Banner';
    icon: 'image';
  };
  attributes: {
    backgroundImage: Attribute.String;
    ctaLink: Attribute.String;
    ctaText: Attribute.String;
    subtitle: Attribute.String;
    title: Attribute.String & Attribute.Required;
  };
}

export interface BlocksFaq extends Schema.Component {
  collectionName: 'components_blocks_faqs';
  info: {
    description: 'Frequently asked questions block';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    faqs: Attribute.Component<'blocks.faq-item', true>;
    title: Attribute.String;
  };
}

export interface BlocksFaqBad extends Schema.Component {
  collectionName: 'components_blocks_faq_bads';
  info: {
    description: 'FAQ block demonstrating bad SEO pattern (conditional rendering)';
    displayName: 'FAQ Bad Pattern';
    icon: 'alert-circle';
  };
  attributes: {
    faqs: Attribute.Component<'blocks.faq-item', true>;
    title: Attribute.String;
  };
}

export interface BlocksFaqGood extends Schema.Component {
  collectionName: 'components_blocks_faq_goods';
  info: {
    description: 'FAQ block demonstrating good SEO pattern (CSS-based visibility)';
    displayName: 'FAQ Good Pattern';
    icon: 'check-circle';
  };
  attributes: {
    faqs: Attribute.Component<'blocks.faq-item', true>;
    title: Attribute.String;
  };
}

export interface BlocksFaqItem extends Schema.Component {
  collectionName: 'components_blocks_faq_items';
  info: {
    description: 'Single FAQ item';
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Attribute.Text & Attribute.Required;
    question: Attribute.String & Attribute.Required;
  };
}

export interface BlocksFeatureCard extends Schema.Component {
  collectionName: 'components_blocks_feature_cards';
  info: {
    description: 'Feature highlight card';
    displayName: 'Feature Card';
    icon: 'grid';
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    icon: Attribute.String;
    title: Attribute.String & Attribute.Required;
  };
}

export interface BlocksFeatures extends Schema.Component {
  collectionName: 'components_blocks_features';
  info: {
    description: 'Features grid section';
    displayName: 'Features';
    icon: 'apps';
  };
  attributes: {
    features: Attribute.Component<'elements.feature-item', true>;
    heading: Attribute.String;
    subheading: Attribute.String;
  };
}

export interface BlocksHero extends Schema.Component {
  collectionName: 'components_blocks_heroes';
  info: {
    description: 'Hero section with title, description and CTA';
    displayName: 'Hero';
    icon: 'star';
  };
  attributes: {
    backgroundImage: Attribute.String;
    ctaLink: Attribute.String;
    ctaText: Attribute.String;
    description: Attribute.Text;
    subtitle: Attribute.String;
    title: Attribute.String & Attribute.Required;
    useSparkles: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface BlocksPostList extends Schema.Component {
  collectionName: 'components_blocks_post_lists';
  info: {
    description: 'List of posts';
    displayName: 'Post List';
    icon: 'list';
  };
  attributes: {
    posts: Attribute.Relation<
      'blocks.post-list',
      'oneToMany',
      'api::post.post'
    >;
    subtitle: Attribute.String;
    title: Attribute.String;
  };
}

export interface BlocksRichText extends Schema.Component {
  collectionName: 'components_blocks_rich_texts';
  info: {
    description: 'Rich text content block';
    displayName: 'Rich Text';
    icon: 'file-text';
  };
  attributes: {
    body: Attribute.RichText & Attribute.Required;
  };
}

export interface BlocksStory extends Schema.Component {
  collectionName: 'components_blocks_stories';
  info: {
    description: 'Long-form story content block';
    displayName: 'Story Block';
    icon: 'book';
  };
  attributes: {
    showShareButton: Attribute.Boolean & Attribute.DefaultTo<false>;
    storyInfo: Attribute.Component<'blocks.story-section', true>;
  };
}

export interface BlocksStorySection extends Schema.Component {
  collectionName: 'components_blocks_story_sections';
  info: {
    description: 'Section within a story';
    displayName: 'Story Section';
    icon: 'file-text';
  };
  attributes: {
    addDivider: Attribute.Boolean & Attribute.DefaultTo<false>;
    description: Attribute.RichText;
    title: Attribute.String;
  };
}

export interface ElementsFeatureItem extends Schema.Component {
  collectionName: 'components_elements_feature_items';
  info: {
    description: 'Single feature item';
    displayName: 'Feature Item';
    icon: 'star';
  };
  attributes: {
    description: Attribute.Text;
    icon: Attribute.String;
    title: Attribute.String & Attribute.Required;
  };
}

export interface SharedNavigation extends Schema.Component {
  collectionName: 'components_shared_navigations';
  info: {
    description: 'Navigation translations';
    displayName: 'Navigation';
    icon: 'link';
  };
  attributes: {
    about: Attribute.String & Attribute.Required;
    backToHome: Attribute.String;
    backToPosts: Attribute.String;
    home: Attribute.String & Attribute.Required;
    loading: Attribute.String;
    noPostsFound: Attribute.String;
    notFound: Attribute.String;
    posts: Attribute.String & Attribute.Required;
    readMore: Attribute.String;
  };
}

export interface SharedNavigationItem extends Schema.Component {
  collectionName: 'components_shared_navigation_items';
  info: {
    description: 'Single navigation item with route reference';
    displayName: 'Navigation Item';
    icon: 'link';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    order: Attribute.Integer & Attribute.DefaultTo<0>;
    route: Attribute.Relation<
      'shared.navigation-item',
      'oneToOne',
      'api::route.route'
    >;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata component';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Attribute.String;
    keywords: Attribute.Text;
    metaDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.banner': BlocksBanner;
      'blocks.faq': BlocksFaq;
      'blocks.faq-bad': BlocksFaqBad;
      'blocks.faq-good': BlocksFaqGood;
      'blocks.faq-item': BlocksFaqItem;
      'blocks.feature-card': BlocksFeatureCard;
      'blocks.features': BlocksFeatures;
      'blocks.hero': BlocksHero;
      'blocks.post-list': BlocksPostList;
      'blocks.rich-text': BlocksRichText;
      'blocks.story': BlocksStory;
      'blocks.story-section': BlocksStorySection;
      'elements.feature-item': ElementsFeatureItem;
      'shared.navigation': SharedNavigation;
      'shared.navigation-item': SharedNavigationItem;
      'shared.seo': SharedSeo;
    }
  }
}
