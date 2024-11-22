import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import ChatBox from 'mf2/ChatBox';

const meta = {
    title: 'Components/ChatBox',
    component: ChatBox,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof ChatBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
