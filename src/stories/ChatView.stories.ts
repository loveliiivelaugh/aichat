import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import ChatView from 'mf2/ChatView';

const meta = {
    title: 'Components/ChatView',
    component: ChatView,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof ChatView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
