import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import MarkdownWrapper from 'mf2/MarkdownWrapper';

const meta = {
    title: 'Components/MarkdownWrapper',
    component: MarkdownWrapper,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof MarkdownWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
