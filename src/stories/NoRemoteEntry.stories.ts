import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import NoRemoteEntry from 'mf2/NoRemoteEntry';

const meta = {
    title: 'Components/NoRemoteEntry',
    component: NoRemoteEntry,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof NoRemoteEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};