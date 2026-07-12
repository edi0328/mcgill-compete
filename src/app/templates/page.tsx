import type { Metadata } from "next";
import { StaggerGrid, StaggerItem } from "@/components/AnimatedSection";
import { Section } from "@/components/Section";
import { TopicTree } from "@/components/TopicTree";
import { templates, topicTree } from "@/content/templates";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Copy-paste algorithm templates in C++ and Python, organized by topic, each with an explanation and an example problem.",
};

export default function TemplatesPage() {
  return (
    <Section
      number="01"
      label="templates"
      title="Template library"
      intro={`${templates.length} algorithms across ${topicTree.length} topics, each in C++ and Python with an example problem. Open a topic and drill down to the one you need.`}
    >
      <StaggerGrid className="max-w-3xl space-y-3">
        {topicTree.map((node, i) => (
          <StaggerItem key={node.name}>
            <TopicTree node={node} defaultOpen={i === 0} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </Section>
  );
}
