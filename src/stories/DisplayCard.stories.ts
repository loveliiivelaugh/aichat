import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import DisplayCard from 'mf2/DisplayCard';

const meta = {
    title: 'Components/DisplayCard',
    component: DisplayCard,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof DisplayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};