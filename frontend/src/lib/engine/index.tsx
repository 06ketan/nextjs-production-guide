import React, { type JSX } from "react";
import type { ComponentType, BlockItem, ComponentProps } from "./types";
import { componentViewMap, componentPropMappings } from "./types";

export interface RenderContext {
  locale?: string;
}

/**
 * Dynamic UI renderer - renders Strapi block components
 */
export async function uiRenderer(
  componentType: ComponentType,
  data: BlockItem,
  context?: RenderContext
): Promise<JSX.Element | null> {
  const Component = componentViewMap?.[componentType];

  if (!Component) {
    console.warn(
      `[UIRenderer] Component "${componentType}" not found in componentViewMap`
    );
    return null;
  }

  try {
    const propMapper = componentPropMappings?.[componentType];
    // Merge context (like locale) into data for components that need it
    const dataWithContext: BlockItem = { ...data, ...context };
    const componentProps: ComponentProps = propMapper
      ? propMapper(dataWithContext)
      : ({ content: dataWithContext } as ComponentProps);

    return <Component {...componentProps} />;
  } catch (error) {
    console.error(`[UIRenderer] Error rendering "${componentType}":`, error);
    return null;
  }
}

/**
 * Render multiple blocks from Strapi
 */
export async function renderBlocks(
  blocks: BlockItem[],
  context?: RenderContext
): Promise<(JSX.Element | null)[]> {
  if (!blocks || !Array.isArray(blocks)) return [];

  const elements = await Promise.all(
    blocks?.map(async (block, index) => {
      const element = await uiRenderer(
        block?.__component as ComponentType,
        block,
        context
      );
      return element
        ? React.cloneElement(element, {
            key: `${block?.__component}-${index}-${block?.id || Date.now()}`,
          })
        : null;
    })
  );

  return elements;
}

// Re-export types
export type { ComponentType, BlockItem, ComponentProps };
