import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import FloatingChat from 'mf2/FloatingChat';

const meta = {
    title: 'Components/FloatingChat',
    component: FloatingChat,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof FloatingChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};