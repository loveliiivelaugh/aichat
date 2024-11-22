import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import NotionDataWrapper from 'mf2/NotionDataWrapper';

const meta = {
    title: 'Components/NotionDataWrapper',
    component: NotionDataWrapper,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof NotionDataWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
