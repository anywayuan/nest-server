import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePostDto, CreateBaseResDto } from './dto/create-post.dto';
import {
  FindAllPostResDto,
  FindAllPostReqDto,
  FindPostByIdResDto,
} from './dto/get-post.dto';

@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章', description: '创建新文章' })
  @ApiResponse({ status: 200, description: 'success', type: CreateBaseResDto })
  @Post()
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '文章列表', description: '获取文章列表' })
  @ApiResponse({ status: 200, description: 'success', type: FindAllPostResDto })
  @Get()
  async findAll(@Query() query: FindAllPostReqDto) {
    return await this.postsService.findAll(query);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @ApiOperation({ summary: '获取文章' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: FindPostByIdResDto,
  })
  @Get(':id')
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @ApiOperation({ summary: '更新文章' })
  @ApiResponse({ status: 200, description: 'success', type: CreateBaseResDto })
  @Put(':id')
  async update(@Param('id') id, @Body() post: CreatePostDto) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除
   * @param id
   */
  @ApiOperation({ summary: '删除文章' })
  @ApiResponse({ status: 200, description: 'success', type: CreateBaseResDto })
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
