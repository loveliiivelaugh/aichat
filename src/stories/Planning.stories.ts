import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import Planning from 'mf2/Planning';

const meta = {
    title: 'Components/Planning',
    component: Planning,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Planning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
